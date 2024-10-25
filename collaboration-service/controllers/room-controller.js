// controllers/RoomController.js
import RoomRepository from '../model/repository.js';

const RoomController = {
    // Create a new room
    async createRoom(req, res) {
        try {
            const { roomId } = req.body;
            const room = await RoomRepository.createRoom(roomId);
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

    // Add user to room
    async addUserToRoom(req, res) {
        try {
            const { userId } = req.body;
            const room = await RoomRepository.addUserToRoom(req.params.id, userId);
            res.status(200).json({ message: "User added", room });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Remove user from room
    async removeUserFromRoom(req, res) {
        try {
            const { userId } = req.body;
            const room = await RoomRepository.removeUserFromRoom(req.params.id, userId);
            res.status(200).json({ message: "User removed", room });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Archive room (deactivate it)
    async archiveRoom(req, res) {
        try {
            const room = await RoomRepository.archiveRoom(req.params.id);
            res.status(200).json({ message: "Room archived", room });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default RoomController;
