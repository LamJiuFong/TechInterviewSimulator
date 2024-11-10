//Broadcast message sent to all users in a room
import { RoomController } from "./room-controller.js";

const ChatController = {
    async broadcastMessage (userId, roomId, message, io) {
        const messageData = {
            sender: userId,
            roomId, 
            content: message.trim(),
            timestamp: new Date().toISOString()
        }
    
        RoomController.writeMessage(roomId, messageData);
        io.to(roomId).emit('receive-message', messageData);
        console.log(`${userId} sent message: ${message} to room ${roomId}`);
    
        return messageData;
    }
} 

export { ChatController};