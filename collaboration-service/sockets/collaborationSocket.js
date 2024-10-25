
import { RoomController } from "../controllers/room-controller.js";

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
    
        socket.on("disconnect", () => {
            console.log(`User ${socket.handshake.query.id} disconnected:`, socket.id);
        });
    });
}

export default collaborationSocket;
