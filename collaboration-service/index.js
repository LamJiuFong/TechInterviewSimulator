import express from 'express';
import cors from 'cors';
import http from "http";
import {Server} from "socket.io";
import collaborationSocket from './sockets/collaborationSocket.js';
import roomRouter from './routes/room-routes.js'

const app = express();
const httpServer = http.createServer(app);

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Use question routes
app.use('/', roomRouter);

app.get('/', (req, res) => {
    res.send('Hello World from collaboration service!');
});

const io = new Server(httpServer, {
    cors: corsOptions,
    transports: ['websocket', 'polling'] // Explicitly state the transports
});

collaborationSocket(io);

export {app, httpServer};