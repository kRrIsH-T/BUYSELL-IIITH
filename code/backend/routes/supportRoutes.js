import express from 'express';
import { handleChat } from '../controllers/supportController.js';

const router = express.Router();

router.post('/chat', handleChat);

export default router;