import express from 'express';
import { createSubmission, getSubmissionResult } from '../controller/code-execution-controller.js';

const router = express.Router();

router.post('/submissions', createSubmission);

router.get('/submissions/:token', getSubmissionResult);

export default router;