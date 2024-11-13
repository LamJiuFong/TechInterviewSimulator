
import { RoomController } from "../controllers/room-controller.js";
import { ChatController } from "../controllers/chat-controller.js";

const collaborationSocket = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.id;
        console.log(`User ${userId} socket connected:`, socket.id);

        socket.on("join-room", async (roomId) => {
            RoomController.addUserToRoom(roomId, userId);
            socket.join(roomId);
            // not used socket.to(roomId).emit("user-joined", userId);

            const code = await RoomController.readCode(roomId);
            const messages = await RoomController.readMessages(roomId);

            const socketsInRoom = await io.in(roomId).allSockets(); // Returns a Set of socket IDs
            console.log(`Sockets in room ${roomId}:`, Array.from(socketsInRoom));

            socket.emit("init-room", code, messages, userId);

            console.log("Init code is called, roomid: ", roomId, " userid: ", userId);
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

        socket.on("disconnecting", () => {
            const rooms = socket.rooms;
            for (const room of rooms) {
                socket.to(room).emit("user-left", userId);
            }
        });
    
        socket.on("disconnect", () => {
            console.log(`User ${socket.handshake.query.id} socket disconnected:`, socket.id);
        });

        socket.on("change-language", async (roomId, code) => {
            socket.to(roomId).emit("receive-change-language", code);
        });

        socket.on("code-running", async (roomId, running) => {
            socket.to(roomId).emit("receive-code-running", running);
        });

        socket.on("change-code-output", async (roomId, status, stdout, stderr) => {
            socket.to(roomId).emit("receive-code-output", status, stdout, stderr);
        });

    });
}

export default collaborationSocket;
