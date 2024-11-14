import Redis from 'ioredis';
import {fetchCategories} from '../internal-services/question-service.js';
import { createRoom } from '../internal-services/collaboration-service.js';

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379
});

const LOOSEN_DIFFICULTY_TIME = 120000; 
const TIMEOUT = 300000;
const cancelMatchmakeUsers = new Map();
const difficulties = ["Easy", "Medium", "Hard"];
const ACCEPT_REQUEST_TIMEOUT = 15000; // 15 seconds
const COLLABORATION_QUEUE = new Map(); // Singleton to store collaboration requests

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

1. User enters queue with selected category:difficulty 
2. Entry into redis queue with userId:socketId:timestamp:difficulty (track difficulty for requeue)
3. Scheduler runs periodically to handle the queues, for category:
    a. Handle each relaxed queue
        i. For every pair available in the queue, pop them out and match them with lower difficulty
        ii. if exists last user in queue, check if timeout:
            - if timeout, remove user and notify
            - else return it to queue
    b. Handle queue of each difficulty 
        i. For every pair available in queue, pop and match 
        ii. if exists last user in queue, check with relaxed queue:
            - if exists, match and take lower difficulty
            - else put into relaxed queue if timestamp exists relaxation timeout
*/

export async function getMatchInUserQueue(category, difficulty, socket) 
{   
    // * User in queue is of userId:socketId:timestamp:difficulty, placed in category:difficulty list
    let userId = socket.handshake.query.id;
    let userIdSocketIdTimestamp  = `${userId}:${socket.id}:${Date.now()}:${difficulty}`;
    const queueName = `${category}:${difficulty}`;
    redis.rpush(queueName, userIdSocketIdTimestamp);   
}

export async function removeUserFromQueue(socket)
{
    let userId = socket.handshake.query.id;
    
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
        // User : [userId, socketId, timestamp, difficulty]
        // * First handle the relaxed difficulty queue at the start of each category
        let queueName = category;
        let queueSize = await redis.llen(queueName);

        
        // * Match all available pairs in the relaxed queue 
        while (queueSize > 1)
        {
            let firstOpponent = await redis.lpop(queueName) 
            firstOpponent = firstOpponent.split(":");
            queueSize--;

            // [userId, socketId, date]
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

            // * if successfully find 2 user, match them, take the lower difficulty.
            const difficulty = difficultyMap[Math.min(difficultyMap[firstOpponent[3]], difficultyMap[secondOpponent[3]])];

            emitMatchFound(io, firstOpponent, secondOpponent, category, difficulty) //
            

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

        // * Iterate through each (category, difficulty) queue\
        // * Same logic for category queue
        for (const difficulty of difficulties) 
        {
            queueName = `${category}:${difficulty}`;
            queueSize = await redis.llen(queueName);
            
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

                    const chosenDifficulty = difficultyMap[Math.min(difficultyMap[opponent[3]], difficulty)];

                    emitMatchFound(io, opponent, remainingUser, category, chosenDifficulty);
                    continue;
                }

                const time = Date.now() - parseInt(remainingUser[2]);

                if (time > LOOSEN_DIFFICULTY_TIME) 
                {   
                    redis.rpush(category,`${remainingUser.join(":")}`);
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
    player1 = {
        userId: player1[0],
        socketId: player1[1],
        hasAccepted: false,
        difficulty:player1[3]
    };

    player2 = {
        userId: player2[0],
        socketId: player2[1],
        hasAccepted: false,
        difficulty:player2[3]
    };

    const matchInfo = {
        category: category,
        difficulty: difficulty,
        acceptanceId: `${player1.userId}-${player2.userId}`,  // change to matchId in the future, check with frontend
        players: [player1, player2]
    };
  
    io.to(player1.socketId).emit("match-found", {
      userId: player1.userId,
      opponentId: player2.userId,
      ...matchInfo
    });

    io.to(player2.socketId).emit("match-found", {
      userId: player2.userId,
      opponentId: player1.userId,
      ...matchInfo
    });

    // Start collaboration request process
    startCollaborationRequest(matchInfo, io);
}

// New code
async function startCollaborationRequest(matchInfo, io) {
    const matchId = matchInfo.acceptanceId;
    // Store the initial state in Redis
    COLLABORATION_QUEUE.set(matchId, {
        ...matchInfo,
        timeout: setTimeout(() => {
            handleCollaborationTimeout(matchId, io);
        }, ACCEPT_REQUEST_TIMEOUT),
    });
}

export async function acceptCollaboration(matchId, userId, io) {
    const collaboration = COLLABORATION_QUEUE.get(matchId);
    
    if (collaboration) {
        // Set acceptance status
        const targetPlayer = collaboration.players.find(player => player.userId === userId)
        if (targetPlayer) {
            targetPlayer.hasAccepted = true;   
        }

        // Check if both players accepted
        if (collaboration.players.every(player => player.hasAccepted)) {
            clearTimeout(collaboration.timeout); // Clear the timeout
            collaboration.players.forEach(player => {
                io.to(player.socketId).emit("collaboration-accepted", matchId);
            })
            COLLABORATION_QUEUE.delete(matchId); // Remove from queue after successful collaboration
            
            const roomInfo = await createRoom(collaboration.category, collaboration.difficulty);
            
            collaboration.players.forEach(player => {
                io.to(player.socketId).emit("created-room", roomInfo);
            });
        }
    }
}

export async function rejectCollaboration(matchId, userId, io) {
    const collaboration = COLLABORATION_QUEUE.get(matchId);
    
    if (collaboration && collaboration.players.find(player => player.userId === userId)) {
        
        for (const player of collaboration.players) {
            if (player.userId != userId) {

                io.to(player.socketId).emit("collaboration-rejected");

            } else {  
                io.to(player.socketId).emit("collaboration-reject");
            }
        }
  
        // Clean up the collaboration queue
        COLLABORATION_QUEUE.delete(matchId);
    }
}

async function handleCollaborationTimeout(matchId, io) {
    const collaboration = COLLABORATION_QUEUE.get(matchId);
    
    if (collaboration) {
        // Notify players of timeout
        for (const player of collaboration.players) {
            io.to(player.socketId).emit("collaboration-timeout");
        }
                
        COLLABORATION_QUEUE.delete(matchId); // Clean up
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