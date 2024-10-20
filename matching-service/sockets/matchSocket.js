import { getMatchInUserQueue, removeUserFromQueue } from "../controller/matching-controller.js";

const matchSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        
        // User enters match
        socket.on('enter-match', (category, difficulty) => {
            getMatchInUserQueue(category, difficulty, socket, io);
        });

        // User cancels match
        socket.on('cancel-match', () => {
            removeUserFromQueue(socket);
        });

        // User disconnects
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export default matchSocket;
