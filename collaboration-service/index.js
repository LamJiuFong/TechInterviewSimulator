import express from 'express';
import cors from 'cors';
import roomRouter from './routes/room-routes.js'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use question routes
app.use('/', roomRouter);

app.get('/', (req, res) => {
    res.send('Hello World from collaboration service!');
});

export default app;