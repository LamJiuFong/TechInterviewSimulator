import Redis from 'ioredis';
import {fetchCategories} from '../internal-services/question-service.js';


const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379
  });

const LOOSEN_DIFFICULTY_TIME = 10000; // number of checks by 
const TIMEOUT = 30000;
const cancelMatchmakeUsers = new Map();
const difficulties = ["Easy", "Medium", "Hard"];
const collaborationTimeout = 15000; // 15 seconds
const collaborationQueue = new Map(); // Store collaboration requests



const difficultyMap = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3,
    1: "Easy",
    2: "Medium",
    3: "Hard"
}

/*
Matching Logic :

1. Client requests to join matching queue -> form webSocket with matching service
2. Join Matching Queue (REDIS LIST), of key (Category, difficulty), with entry (UserId, SocketId, timestamp)
3. Run schedule matching (5 - 10s) with scheduler (w/ setInterval)
    a. iterate through each (category, difficulty) queue
        i. If len(queue) > 2 : pop the queue by pair until len(queue) < 2, notify match found for both user
        ii If len(queue) == 1: check time stamp if it exceeds the waiting time on same category
            - If exceeds, pop out and notify timeout 
            - If exceed timing for same difficulty, pop from current queue, put into (category) queue, with new time stamp with new key (UserId, SocketId, timestamp, difficulty)

*/

export async function getMatchInUserQueue(category, difficulty, socket, io) 
{   
    // * User in queue is of userId:socketId:timestamp, placed in (category:difficulty) list
    let userId = socket.handshake.query.id;
    let userIdSocketIdTimestamp  = `${userId}:${socket.id}:${Date.now()}`;
    const queueName = `${category}:${difficulty}`;
    redis.rpush(queueName, userIdSocketIdTimestamp);    
}

export async function removeUserFromQueue(socket)
{
    let userId = socket.handshake.query.id;
    
    // keep track of timestamp of current cancel to prevent cancelling future matching 
    // * Only keep track of the latest cancel, if there exists any stray entry in match queue before this timestamp will be removed
    cancelMatchmakeUsers.set(userId, Date.now());
}


// TODO: Handle race condition when horizontal scaling matchmaking service 
export async function matchUserInQueue(io)
{

    const categories = await fetchCategories();
    printAllQueues(categories, difficulties);

    for (const category of categories) 
    {

        // * First handle the all difficulty queue at the start of each category
        let queueName = category;
        let queueSize = await redis.llen(queueName);

        
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
                if (!cancelMatchmakeUsers.has(firstOpponent[0]) || cancelMatchmakeUsers.get(firstOpponent[0]) < firstOpponent[2]) 
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

            emitMatchFound(io, firstOpponent, secondOpponent, category, difficulty)
            

        }

        // * Check on last person in queue ttl
        if (queueSize == 1)
        {
            let remainingUser = await redis.lpop(queueName);
            remainingUser = remainingUser.split(":");

            const time = Date.now() - parseInt(remainingUser[2]);
            // * Prompt user timeout 
            if (time > TIMEOUT)
            {
                io.to(remainingUser[1]).emit("timeout", remainingUser[0]);
            }
            else if (!cancelMatchmakeUsers.has(remainingUser[0]) || cancelMatchmakeUsers.get(remainingUser[0]) < remainingUser[2]) 
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
                    if (!cancelMatchmakeUsers.has(firstOpponent[0]) || cancelMatchmakeUsers.get(firstOpponent[0]) < firstOpponent[2]) 
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

                emitMatchFound(io, firstOpponent, secondOpponent, category, difficulty);
            }

            if (queueSize == 1)
            {
                let remainingUser = await redis.lpop(queueName)
                remainingUser = remainingUser.split(":");

                // * check if there's any player from loosen_difficulty queue to match with 
                const noDifficultyQueueSize = await redis.llen(category);

                if (noDifficultyQueueSize > 0) 
                {
                    let opponent = await redis.lpop(category);
                    opponent = opponent.split(":");
                    emitMatchFound(io, opponent, remainingUser, category, difficulty);
                    continue;
                }

                const time = Date.now() - parseInt(remainingUser[2]);

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


// helper function
function emitMatchFound(io, player1, player2, category, difficulty) {
    const matchInfo = {
      category: category,
      difficulty: difficulty
    };
  
    io.to(player1[1]).emit("match-found", {
      userId: player1[0],
      opponentId: player2[0],
      acceptanceId: `${player1[0]}-${player2[0]}`,
      ...matchInfo
    });
    io.to(player2[1]).emit("match-found", {
      userId: player2[0],
      opponentId: player1[0],
      acceptanceId: `${player1[0]}-${player2[0]}`,
      ...matchInfo
    });

    // Start collaboration request process
    startCollaborationRequest(player1, player2, io);
  }

async function startCollaborationRequest(player1, player2, io) {
    const requestId = `${player1[0]}-${player2[0]}`;
    
    // Store the initial state in Redis
    collaborationQueue.set(requestId, {
        players: [player1, player2],
        accepted: [false, false],
        timeout: null,
    });

    // Set a timeout for collaboration acceptance
    collaborationQueue.get(requestId).timeout = setTimeout(() => {
        handleCollaborationTimeout(requestId, io);
    }, collaborationTimeout);
}

export async function acceptCollaboration(requestId, userId, io) {
    console.log(collaborationQueue)
    const collaboration = collaborationQueue.get(requestId);
    
    if (collaboration && collaboration.players.find(player => player[0] === userId)) {
        // Set acceptance status
        const playerIndex = collaboration.players.findIndex(player => player[0] === userId);
        collaboration.accepted[playerIndex] = true;

        // Check if both players accepted
        if (collaboration.accepted.every(accepted => accepted)) {
            clearTimeout(collaboration.timeout); // Clear the timeout
            io.to(collaboration.players[0][1]).emit("collaboration-accepted", requestId);
            io.to(collaboration.players[1][1]).emit("collaboration-accepted", requestId);
            collaborationQueue.delete(requestId); // Remove from queue after successful collaboration
        }
    }
}

export async function rejectCollaboration(requestId, userId, io) {
    const collaboration = collaborationQueue.get(requestId);
    
    if (collaboration && collaboration.players.find(player => player[0] === userId)) {
        // Notify both players of rejection
        io.to(collaboration.players[0][1]).emit("collaboration-rejected", requestId);
        io.to(collaboration.players[1][1]).emit("collaboration-rejected", requestId);
        
        // Clean up the collaboration queue
        collaborationQueue.delete(requestId);
    }
}

async function handleCollaborationTimeout(requestId, io) {
    const collaboration = collaborationQueue.get(requestId);
    
    if (collaboration) {
        // Notify players of timeout
        io.to(collaboration.players[0][1]).emit("collaboration-rejected", requestId);
        io.to(collaboration.players[1][1]).emit("collaboration-rejected", requestId);
        collaborationQueue.delete(requestId); // Clean up
    }
}
  // Helper function to print a Redis list's state
  async function printRedisList(queueName) {
    const list = await redis.lrange(queueName, 0, -1); // Fetch entire list
    if (list.length === 0) {
        return; // Return early if the list is empty
    }

    console.log(`List "${queueName}" contains ${list.length} items:`);
    list.forEach((item, index) => {
        console.log(`Index ${index}: ${item}`);
    });
}

// Call this after running matchUserInQueue to print all queue states
async function printAllQueues(categories, difficulties) {
    for (const category of categories) {
        await printRedisList(category); // Print (category) queue
        for (const difficulty of difficulties) {
            const queueName = `${category}:${difficulty}`;
            await printRedisList(queueName); // Print (category:difficulty) queues
        }
    }
}