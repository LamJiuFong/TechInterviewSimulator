import express from 'express';
import cors from 'cors';
import http from "http";
import router from './routes/code-execution-route.js';

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/code-execution', router);

app.get('/', (req, res) => {
    res.send('Hello World from code execution service!');
}
);

httpServer.listen(3005, () => {
    console.log('Code execution service listening on port 3005');
}
);

export default app;