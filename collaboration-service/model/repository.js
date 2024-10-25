// repositories/RoomRepository.js
import "dotenv/config";
import { connect } from "mongoose";
import { Room } from "./room-model.js"

export async function connectToDB() {
    let mongoDBUri =
      process.env.ENV === "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;
  
    await connect(mongoDBUri);
}

const RoomRepository = {
    // Create a new room
    async createRoom() {
        const room = new Room();
        await room.save();
        return room;
    },

    // Find a room by ID
    async findRoomById(roomId) {
        return await Room.findById(roomId);
    },

    // Find all active rooms
    async findActiveRooms() {
        return await Room.find({ is_active: true });
    },

    // Add a user to the room
    async addUserToRoom(roomId, userId) {
        const room = await Room.findById(roomId);
        if (room) {
            room.participants.push(userId);  // Add participant as a simple string
            await room.save();
            return room;
        } else {
            throw new Error('Room is full or does not exist');
        }
    },

    // Remove a user from the room
    async removeUserFromRoom(roomId, userName) {
        const room = await Room.findById(roomId);
        if (room) {
            room.participants = room.participants.filter(participant => participant !== userName);
            await room.save();
            return room;
        } else {
            throw new Error('Room does not exist');
        }
    },

    // Archive a room (deactivate it)
    async archiveRoom(roomId) {
        const room = await Room.findByIdAndUpdate(roomId, { is_active: false }, { new: true });
        return room;
    }
};

export default RoomRepository;
