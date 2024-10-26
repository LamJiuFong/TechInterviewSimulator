
import { RoomController } from "../controllers/room-controller.js";
import { broadcastMessage } from "../controllers/room-controller.js";

const collaborationSocket = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.id;
        console.log(`User ${userId} connected:`, socket.id);
        socket.on("join-room", (roomId) => {
            RoomController.addUserToRoom(roomId, userId);
        });
        
        socket.on("leave-room", (roomId) => {
            RoomController.removeUserFromRoom(roomId, userId);
        });

        socket.on("message", async (roomId, message) => {
            const result = await broadcastMessage(userId, roomId, message, io);
            if (result.error) {
                socket.emit("error", {message: result.error});
            }
        });
    
        socket.on("disconnect", () => {
            console.log(`User ${socket.handshake.query.id} disconnected:`, socket.id);
        });
    });
}

export default collaborationSocket;
