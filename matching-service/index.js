import express from 'express';
import cors from 'cors';
import http from "http";
import {Server} from "socket.io";
import matchSocket from './sockets/matchSocket.js';
import matchScheduler from './schedulers/matchScheduler.js';

const app = express();
const httpServer = http.createServer(app);

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from matching service!');
});

const io = new Server(httpServer, {
    cors: corsOptions,
    transports: ['websocket', 'polling'] // Explicitly state the transports
});


matchSocket(io);

matchScheduler(io);

httpServer.listen(3006, () => {
    console.log('Matching service listening on port 3006');
}
);

export default app;






