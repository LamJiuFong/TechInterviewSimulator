import express from 'express';
import cors from 'cors';
import http from "http";
import {Server} from "socket.io";
import {getMatchInUserQueue} from "./controller/matching-controller.js";

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from matching service!');
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
    socket.on('get-match', (category, difficulty) => {     
        getMatchInUserQueue(category, difficulty, socket, io);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});



httpServer.listen(3006, () => {
    console.log('Matching service listening on port 3006');
}
);

export { io };

export default app;






