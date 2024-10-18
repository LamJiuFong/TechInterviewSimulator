import Redis from 'ioredis';
import { io } from '../index.js';


const redis = new Redis({
    host: 'localhost',
    port: 6379,
  });

const CHECK_INTERVAL = 3000; // interval to run schedule matching
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

const difficultyMap = {
    "easy": 1,
    "medium": 2,
    "hard": 3,
    1: "easy",
    2: "medium",
    3: "hard"
}


// TODO: Handle race condition when horizontal scaling matchmaking service 
async function matchUserInQueue()
{
    console.log("==============================================================")

    // TODO: Query category from question service or store cached version of categories in redis
    const categories = ["array"];
    const difficulties = ["easy", "medium", "hard"];


    for (const category of categories) 
    {

        // * First handle the all difficulty queue at the start of each category
        let queueName = category;
        let queueSize = await redis.llen(queueName);

        console.log(queueName)
        console.log(queueSize)
        
        // * Match all available pairs in the queue 
        while (queueSize > 1)
        {
            let firstOpponent = await redis.lpop(queueName) 
            firstOpponent = firstOpponent.split(":");
            queueSize--;

            // * If the current entry has already been cancelled, find the next available one
            while (queueSize > 0 && cancelMatchmakeUsers.has(firstOpponent[0]) && cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2])
            {
                firstOpponent = await redis.lpop(queueName);
                firstOpponent = firstOpponent.split(":");
                queueSize--;
            }

            // * Given user is the last in queue, there can't be a second opponent for matching
            if (queueSize == 0) 
            {
                // * if not ttl, put the user back in queue
                if (!cancelMatchmakeUsers.has(firstOpponent[0]) || !cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2]) 
                {
                    redis.rpush(queueName, firstOpponent.join(":"));
                    queueSize++;
                }

                break;
            }
            let secondOpponent = await redis.lpop(queueName);
            secondOpponent = secondOpponent.split(":");
            queueSize--;

            // * Find available secondOpoponent
            while (queueSize > 0 && cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
            {
                secondOpponent = await redis.lpop(queueName);
                secondOpponent = secondOpponent.split(":");
                queueSize--;
            }

            // * If last user in queue also cancelled, place first player back in queue
            if (queueSize == 0 && cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
            {
                redis.rpush(queueName, firstOpponent.join(":"));
                queueSize++;
                break;
            }

            // * if successfully find 2 user, match them 
            const difficulty = difficultyMap[Math.floor((difficultyMap[firstOpponent[3]] + difficultyMap[secondOpponent[3]]) / 2)];

            emitMatchFound(firstOpponent, secondOpponent, category, difficulty)
            

        }

        // * Check on last person in queue ttl
        if (queueSize == 1)
        {
            let remainingUser = await redis.lpop(queueName);
            console.log(remainingUser)
            remainingUser = remainingUser.split(":");

            const time = Date.now() - parseInt(remainingUser[2]);
            console.log(time);

            // * Prompt user timeout 
            if (time > TIMEOUT)
            {
                io.to(remainingUser[1]).emit("timeout", remainingUser[0]);
            }
            else if (!cancelMatchmakeUsers.has(remainingUser[0]) || !cancelMatchmakeUsers.get(remainingUser[0]) > remainingUser[2]) 
            {
                // * Push back to queue if did not timeout nor entry is cancelled
                redis.rpush(queueName, remainingUser.join(":"))
            }

        }

        // * Iterate through each (category, difficulty) queue
        for (const difficulty of difficulties) 
        {
            queueName = `${category}:${difficulty}`;
            queueSize = await redis.llen(queueName);
            console.log(queueName)
            console.log(queueSize)
            // * Same logic for (category) queue
            while (queueSize > 1)
            {
                let firstOpponent = await redis.lpop(queueName)
                firstOpponent = firstOpponent.split(":");
                queueSize--;

                while (queueSize > 0 && cancelMatchmakeUsers.has(firstOpponent[0]) && cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2])
                {
                    firstOpponent = await redis.lpop(queueName);
                    firstOpponent = firstOpponent.split(":");
                    queueSize--;
                }


                if (queueSize == 0) 
                {
                    // if not ttl, put the user back in queue
                    if (!cancelMatchmakeUsers.has(firstOpponent[0]) || !cancelMatchmakeUsers.get(firstOpponent[0]) > firstOpponent[2]) 
                    {
                        redis.rpush(queueName, firstOpponent.join(":"));
                        queueSize++;
                    }

                    break;
                }
                let secondOpponent = await redis.lpop(queueName);
                secondOpponent = secondOpponent.split(":");
                queueSize--;

                while (queueSize > 0 && cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
                {
                    secondOpponent = await redis.lpop(queueName);
                    secondOpponent = secondOpponent.split(":");
                    queueSize--;
                }

                if (cancelMatchmakeUsers.has(secondOpponent[0]) && cancelMatchmakeUsers.get(secondOpponent[0]) > secondOpponent[2])
                {
                    redis.rpush(queueName, firstOpponent.join(":"));
                    queueSize++;
                    break;
                }

                emitMatchFound(firstOpponent, secondOpponent, category, difficulty);
            }

            if (queueSize == 1)
            {
                let remainingUser = await redis.lpop(queueName)
                console.log(remainingUser);
                remainingUser = remainingUser.split(":");

                // * check if there's any player from loosen_difficulty queue to match with 
                const noDifficultyQueueSize = await redis.llen(category);

                if (noDifficultyQueueSize > 0) 
                {
                    let opponent = await redis.lpop(category);
                    opponent = opponent.split(":");
                    emitMatchFound(opponent, remainingUser, category, difficulty);
                    continue;
                }

                const time = Date.now() - parseInt(remainingUser[2]);
                console.log(remainingUser[2])
                console.log(time);

                if (time > LOOSEN_DIFFICULTY_TIME) 
                {   
                    redis.rpush(category,`${remainingUser.join(":")}:${difficulty}`);
                    io.to(remainingUser[1]).emit("loosen-difficulty", remainingUser[0]);
                }
                else 
                {
                    redis.rpush(queueName, remainingUser.join(":"));
                }
            }
            
        }

    }
    
}

setInterval(matchUserInQueue, CHECK_INTERVAL);


// helper function
function emitMatchFound(player1, player2, category, difficulty) {
    const matchInfo = {
      category: category,
      difficulty: difficulty
    };
  
    io.to(player1[1]).emit("match-found", {
      userId: player1[0],
      opponentId: player2[0],
      ...matchInfo
    });
    io.to(player2[1]).emit("match-found", {
      userId: player2[0],
      opponentId: player1[0],
      ...matchInfo
    });
  }