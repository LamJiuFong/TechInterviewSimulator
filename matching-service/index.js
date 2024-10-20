import express from 'express';
import cors from 'cors';
import http from "http";
import {Server} from "socket.io";
import {getMatchInUserQueue, removeUserFromQueue} from "./controller/matching-controller.js";
import matchSocket from './sockets/matchSocket.js';
import matchScheduler from './schedulers/matchScheduler.js';

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from matching service!');
});

const io = new Server(httpServer);

matchSocket(io);

matchScheduler(io);

httpServer.listen(3006, () => {
    console.log('Matching service listening on port 3006');
}
);

export default app;






