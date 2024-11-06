
import { RoomController } from "../controllers/room-controller.js";
import { ChatController } from "../controllers/chat-controller.js";

const collaborationSocket = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.id;
        console.log(`User ${userId} connected:`, socket.id);
        socket.on("join-room", (roomId) => {
            RoomController.addUserToRoom(roomId, userId);
            socket.join(roomId);
            socket.to(roomId).emit("user-joined", userId);
        });
        
        socket.on("leave-room", (roomId) => {
            RoomController.removeUserFromRoom(roomId, userId);
            socket.leave(roomId);
            socket.to(roomId).emit("user-left", userId);
        });

        socket.on("write-code", async (roomId, code) => {
            RoomController.writeCode(roomId, code);
            socket.to(roomId).emit("read-code", code);
        });

        //Handling the sending of messages
        socket.on("message", (userId, roomId, message) => {
            ChatController.broadcastMessage(userId, roomId, message, io);
        });

        //Handling video calling
        socket.on("offer", (roomId, data) => {
            socket.to(roomId).emit("offer", { 
                answer: data?.answer, 
                senderId: userId
            });
        })

        socket.on("answer", (data) => {
            socket.to(data.roomId).emit("answer", {
                answer: data.answer,
                senderId: userId
            });
        });

        socket.on("ice-candidate", (data) => {
            socket.to(data.roomId).emit("ice-candidate", {
                candidate: data.candidate,
                senderId: userId
            });
        });
    
        socket.on("disconnect", () => {
            console.log(`User ${socket.handshake.query.id} disconnected:`, socket.id);
        });
    });
}

export default collaborationSocket;
