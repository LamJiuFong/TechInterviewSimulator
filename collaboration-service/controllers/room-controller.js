// controllers/RoomController.js
import RoomRepository from '../model/repository.js';
import Redis from 'ioredis';

const roomRedis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379
  });

const RoomController = {
    // Create a new room
    async createRoom(req, res) {
        try {
            const { category, difficulty } = req.body;
            // Validate if both category and difficulty are provided
            if (!category || !difficulty) {
                return res.status(400).json({ 
                    error: "Both 'category' and 'difficulty' are required." 
                });
            }
            const room = await RoomRepository.createRoom(category, difficulty);
            res.status(200).json({ message: "Room created", room });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get room by ID
    async getRoomById(req, res) {
        try {
            const room = await RoomRepository.findRoomById(req.params.id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all active rooms
    async getActiveRooms(req, res) {
        try {
            const rooms = await RoomRepository.findActiveRooms();
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async addUserToRoom(roomId, userId) {
        const room = await RoomRepository.addUserToRoom(roomId, userId);
        await roomRedis.sadd(`room:${roomId}`, userId);

        const members = await roomRedis.smembers(`room:${roomId}`);
        console.log('Members of the set:', members);

        return room;
    },

    async removeUserFromRoom(roomId, userId) {
        // const room = await RoomRepository.removeUserFromRoom(roomId, userId); commented out first cos got some errors
        await roomRedis.srem(`room:${roomId}`, userId);

        const members = await roomRedis.smembers(`room:${roomId}`);
        console.log('Members of the set:', members);

        const userCount = await roomRedis.scard(`room:${roomId}`);
        if (userCount === 0) {
            // If no users are left in Redis, archive the room in the database
            await RoomRepository.archiveRoom(roomId);
        }
        // return room;
    },

    async readCode(roomId) {
        const code = await roomRedis.lrange(`room:${roomId}-code`, -1, -1);
        return code[0]; // the only element
    },

    async writeCode(roomId, code) {
        await roomRedis.rpop(`room:${roomId}-code`);
        await roomRedis.rpush(`room:${roomId}-code`, code);
    },

    async readMessages(roomId) {
        let messages = await roomRedis.lrange(`room:${roomId}-messages`, 0, -1);
        messages = messages.map(JSON.parse);

        return messages;
    },

    async writeMessage(roomId, message) {
        await roomRedis.rpush(`room:${roomId}-messages`, JSON.stringify(message));
    }
};

export { RoomController, roomRedis };
