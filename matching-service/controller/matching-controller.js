import Redis from 'ioredis';

const redis = new Redis({
    host: 'localhost',
    port: 6379,
  });

export async function getMatchInUserQueue(category, difficulty, socket, io) 
{   
    let userId = socket.handshake.query.id;
    let userIdSocketId = `${userId}:${socket.id}`;
    const queueName = `${category}:${difficulty}`;
    const queueSizeIfExist = await redis.llen(queueName);
    console.log('queueSizeIfExist', queueSizeIfExist);
    if (queueSizeIfExist > 0) {
        let opponentUserIdSocketId = await redis.lpop(queueName);
        const opponentUserId = opponentUserIdSocketId.split(':')[0];
        const opponentSocketId = opponentUserIdSocketId.split(':')[1];
        socket.emit('match-found', opponentUserId);
        // get opponent's socket and emit match found
        io.to(opponentSocketId).emit('match-found', userId);
    } else {
        await redis.rpush(queueName, userIdSocketId);
    }
}
