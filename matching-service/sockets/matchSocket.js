import { acceptCollaboration, getMatchInUserQueue, rejectCollaboration, removeUserFromQueue } from "../controller/matching-controller.js";

const matchSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User ${socket.handshake.query.id} connect with socket id ${socket.id}`);
        
        // User enters match
        socket.on('enter-match', (criteria) => {
            const {category, difficulty} = criteria;
            console.log(`User enter match with ${category} and ${difficulty}`);
            getMatchInUserQueue(category, difficulty, socket, io);
        });

        // User cancels match
        socket.on('cancel-match', () => {
            removeUserFromQueue(socket);
            console.log(`User ${socket.handshake.query.id} cancel matching`);
        });

        // User accept match
        socket.on('accept-match', (acceptanceId) => {
            acceptCollaboration(acceptanceId, socket.handshake.query.id, io);
            console.log(`User ${socket.handshake.query.id} accept match`);
        });

        // User reject match
        socket.on('reject-match', (acceptanceId) => {
            rejectCollaboration(acceptanceId, socket.handshake.query.id, io);
            console.log(`User ${socket.handshake.query.id} reject match`);
        });



        // User disconnects
        socket.on('disconnect', () => {
            removeUserFromQueue(socket);
            console.log(`User ${socket.handshake.query.id} disconnected with socket id`, socket.id);
        });
    });
};

export default matchSocket;
