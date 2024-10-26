//Broadcast message sent to all users in a room

const broadcastMessage = async (userId, roomId, message, io) => {
    const messageData = {
        sender: userId,
        roomId, 
        content: message.trim(),
        timestamp: new Date().toISOString()
    }

    io.to(roomId).emit('message', messageData);
    console.log(`${userId} sent message: ${message} to room ${roomId}`);

    return messageData;
};

export default broadcastMessage;