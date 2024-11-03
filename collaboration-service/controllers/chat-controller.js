//Broadcast message sent to all users in a room

const ChatController = {
    async broadcastMessage (userId, roomId, message, io) {
        const messageData = {
            sender: userId,
            roomId, 
            content: message.trim(),
            timestamp: new Date().toISOString()
        }
    
        io.to(roomId).emit('receive-message', messageData);
        console.log(`${userId} sent message: ${message} to room ${roomId}`);
    
        return messageData;
    }
} 

export { ChatController};