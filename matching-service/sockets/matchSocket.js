import { getMatchInUserQueue, removeUserFromQueue } from "../controller/matching-controller.js";

const matchSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        
        // User enters match
        socket.on('enter-match', (criteria) => {
            const {category, difficulty} = criteria;
            console.log(`User enter match with ${category} and ${difficulty}`);
            getMatchInUserQueue(category, difficulty, socket, io);
        });

        // User cancels match
        socket.on('cancel-match', () => {
            removeUserFromQueue(socket);
            console.log("User cancel matching");
        });

        // User disconnects
        socket.on('disconnect', () => {
            removeUserFromQueue(socket);
            console.log('User disconnected:', socket.id);
        });
    });
};

export default matchSocket;
