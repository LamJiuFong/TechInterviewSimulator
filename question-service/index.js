import express from 'express';
import cors from 'cors';
import questionRouter from './routes/question-route.js'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use question routes
app.use('/api/questions', questionRouter);

app.get('/', (req, res) => {
    res.send('Hello World from question service!');
});

export default app;