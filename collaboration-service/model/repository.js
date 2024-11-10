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
    async createRoom(category, difficulty) {
        const room = new Room({
            question: {
                category,
                difficulty
            }
        });
        await room.save();
        console.log("Room created, roomId: ", room._id);
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
            if (!room.participants.includes(userId)) {
                room.participants.push(userId); // Only add if userId is not already in participants
            }
            await room.save();
            return room;
        } else {
            throw new Error('Room is full or does not exist');
        }
    },

    // Remove a user from the room
    async removeUserFromRoom(roomId, userId) {
        const room = await Room.findById(roomId);
        if (room) {
            room.participants = room.participants.filter(participant => participant !== userId);
            await room.save();
            console.log("Removed user from room :", roomId, "user: ", userId);
            return room;
        } else {
            throw new Error('Room does not exist');
        }
    },

    // Archive a room (deactivate it)
    async archiveRoom(roomId) {
        const room = await Room.findByIdAndUpdate(roomId, { is_active: false }, { new: true });
        console.log("Deactivated room :", roomId);
        return room;
    }
};

export default RoomRepository;
