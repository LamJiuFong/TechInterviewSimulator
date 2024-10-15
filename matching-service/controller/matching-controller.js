import Redis from 'ioredis';

const redis = new Redis({
    host: 'localhost',
    port: 6379,
  });

const CHECK_INTERVAL = 5000; // interval to run schedule matching
const LOOSEN_DIFFICULTY_TIME = 10000; // number of checks by 
const TIMEOUT = 30000;

const cancelMatchmakeUsers = new Map();


/*
Matching Logic :

1. Client requests to join matching queue -> form webSocket with matching service
2. Join Matching Queue (REDIS LIST), of key (Category, difficulty), with entry (UserID, timestamp)
3. Run schedule matching (5 - 10s) with scheduler (w/ setInterval)
    a. iterate through each (category, difficulty) queue
        i. If len(queue) > 2 : pop the queue by pair until len(queue) < 2, notify match found for both user
        ii If len(queue) == 1: check time stamp if it exceeds the waiting time on same category
            - If exceeds, pop out and notify timeout 
            - If exceed timing for same difficulty, pop from current queue, put into (category) queue, with new time stamp with new key (UserId, timestamp, difficulty)

*/

export async function getMatchInUserQueue(category, difficulty, socket, io) 
{   
    // * User in queue is of userId:socketId:timestamp, placed in (category:difficulty) list
    let userId = socket.handshake.query.id;
    let userIdSocketId = `${userId}:${socket.id}:${Date.now()}`;
    const queueName = `${category}:${difficulty}`;
    
    redis.rpush(queueName, userIdSocketId);
    
}

export async function removeUserFromQueue(category, difficulty, socket, io)
{
    let userId = socket.handshake.query.id;
    
    // keep track of timestamp of current cancel to prevent cancelling future matching 
    // * Only keep track of the latest cancel, if there exists any stray entry in match queue before this timestamp will be removed
    cancelMatchmakeUsers.set(userId, Date.now());
}

// TODO: Handle race condition when horizontal scaling matchmaking service 
async function matchUserInQueue()
{

    // TODO: Query category from question service or store cached version of categories in redis
    const categories = [];
    const difficulties = ["easy", "medium", "hard"];


    for (const category of categories) 
    {

        // * First handle the all difficulty queue at the start of each category
        const queueName = category;
        const queueSize = await redis.llen(queueName);
        
        // * Match all available pairs in the queue 
        while (queueSize > 1)
        {
            let firstOpponent = await redis.lpop(queueName).split(":");
            queueSize--;

            // * If the current entry has already been cancelled, find the next available one
            while (queueSize > 0 && cancelMatchmakeUsers.has(firstOpponent[0]) && cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2])
            {
                firstOpponent = await redis.lpop(queueName).split(":");
                queueSize--;
            }

            // * Given user is the last in queue, there can't be a second opponent for matching
            if (queueSize == 0) 
            {
                // * if not ttl, put the user back in queue
                if (!cancelMatchmakeUsers.has(firstOpponent[0]) || !cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2]) 
                {
                    redis.rpush(queueName, firstOpponent);
                    queueSize++;
                }

                break;
            }
            let secondOpponent = await reids.lpop(queueName).split(":");
            queueSize--;

            // * Find available secondOpoponent
            while (queueSize > 0 && cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
            {
                secondOpponent = await redis.lpop(queueName).split(":");
                queueSize--;
            }

            // * If last user in queue also cancelled, place first player back in queue
            if (queueSize == 0 && cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
            {
                redis.rpush(queueName, firstOpponent);
                queueSize++;
                break;
            }

            // * if successfully find 2 user, match them 
            const difficulty = Math.floor((parseInt(firstOpponent[3]) + parseInt(secondOpponent[3])) / 2);

            io.to(firstOpponent[1]).emit("match-found", secondOpponent[0]);
            io.to(secondOpponent[1]).emit("match-found", firstOpponent[1]);

            

        }

        // * Check on last person in queue ttl
        if (queueSize == 1)
        {
            let remainingUser = await redis.lpop(queueName).split(":");

            const time = Date.now() - parseInt(remainingUser[2]);

            // * Prompt user timeout 
            if (time > TIMEOUT)
            {
                io.to(remainingUser[1]).emit("matchmake-timeout");
            }
            elif (!cancelMatchmakeUsers.has(remainingUser[0]) || !cancelMatchmakeUsers.get(remainingUser[0]) > remainingUser[2]) 
            {
                // * Push back to queue if did not timeout nor entry is cancelled
                redis.rpush(queueName, remainingUser)
            }

        }

        // * Iterate through each (category, difficulty) queue
        for (const difficulty of difficulties) 
        {
            queueName = `${category}:${difficulty}`;
            queueSize = redis.llen(queueName);

            // * Same logic for (category) queue
            while (queueSize > 1)
            {
                let firstOpponent = await redis.lpop(queueName).split(":");
                queueSize--;

                while (queueSize > 0 && cancelMatchmakeUsers.has(firstOpponent[0]) && cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2])
                {
                    firstOpponent = await redis.lpop(queueName).split(":");
                    queueSize--;
                }

                
                if (queueSize == 0) 
                {
                    // if not ttl, put the user back in queue
                    if (!cancelMatchmakeUsers.has(firstOpponent[0]) || !cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2]) 
                    {
                        redis.rpush(queueName, firstOpponent);
                        queueSize++;
                    }

                    break;
                }
                let secondOpponent = await reids.lpop(queueName).split(":");
                queueSize--;

                while (queueSize > 0 && cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
                {
                    secondOpponent = await redis.lpop(queueName).split(":");
                    queueSize--;
                }

                if (cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
                {
                    redis.rpush(queueName, firstOpponent);
                    queueSize++;
                    break;
                }

                const difficulty = Math.floor((parseInt(firstOpponent[3]) + parseInt(secondOpponent[3])) / 2);

                io.to(firstOpponent[1]).emit("match-found", secondOpponent[0]);
                io.to(secondOpponent[1]).emit("match-found", firstOpponent[1]);
            }

            if (queueSize == 1)
            {
                let remainingUser = await redis.lpop(queueName).split(":");

                // * check if there's any player from loosen_difficulty queue to match with 
                const noDifficultyQueueSize = await redis.llen(category);

                if (noDifficultyQueueSize > 0) 
                {
                    let opponent = await redis.lpop(category);

                    io.to(opponent[1]).emit("match-found", remainingUser[0]);
                    io.to(remainingUser[1]).emit("match-found", opponent[1]);
                    continue;
                }

                const time = Date.now() - parseInt(remainingUser[2]);

                if (time > LOOSEN_DIFFICULTY_TIME) 
                {
                    redis.rpush(category,`${remainingUser}:${difficulty}`);
                    io.to(remainingUser[1]).emit("loosen-difficulty");
                }
                else 
                {
                    redis.rpush(queueName, remainingUser);
                }
            }
            
        }

    }
    
}

setInterval(matchUserInQueue, CHECK_INTERVAL);