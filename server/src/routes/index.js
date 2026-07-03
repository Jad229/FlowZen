import express from 'express';
import { getBoards, getBoard, createBoard, deleteBoard } from './boards.js';

const router = express.Router();

// Placeholder root API route. Replace or extend with board/command/undo routes later.
router.get('/', (req, res) => {
  res.json({ message: 'FlowZen API' });
});

router.get('/boards', getBoards)
router.get('/boards/:id', getBoard)
router.post('/boards', createBoard)
router.post('/boards/:id/commands', async (req, res) => {
  const { id: boardId } = req.params
  const { type, payload } = req.body
  try {
    const board = await applyCommand(boardId, type, payload)
    res.json({ message: 'Board command applied successfully' })
  } catch (error) {
    res.json({ message: 'Could not apply command', error })
  }


})
router.delete('/boards/:id', deleteBoard)


export default router;
