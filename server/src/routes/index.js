import express from 'express';
import { query, transaction } from '../../db/db.js';
import { getBoards, getBoard, createBoard, deleteBoard } from './boards.js';

const router = express.Router();

// Placeholder root API route. Replace or extend with board/command/undo routes later.
router.get('/', (req, res) => {
  res.json({ message: 'FlowZen API' });
});

router.get('/boards', getBoards)
router.get('/boards/:id', getBoard)
router.post('/boards', createBoard)
router.delete('/boards/:id', deleteBoard)

export default router;
