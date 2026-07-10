import express from 'express';
import { getBoards, getBoard, createBoard, deleteBoard } from './boards.js';
import { applyCommand, undo, redo } from '../services/commandService.js';

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

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ message: 'Command "type" is required and must be a string' })
  }
  if (payload == null || typeof payload !== 'object') {
    return res.status(400).json({ message: 'Command "payload" is required and must be an object' })
  }

  try {
    const board = await applyCommand(boardId, type, payload)
    res.json({ message: 'Board command applied successfully', board })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ message: 'Could not apply command', error: error.message })
  }
})
router.post('/boards/:id/undo', async (req, res) => {
  const { id: boardId } = req.params;

  try {
    const board = await undo(boardId);
    res.json({ message: 'Undo applied successfully', board });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: 'Could not undo', error: error.message });
  }
});

router.post('/boards/:id/redo', async (req, res) => {
  const { id: boardId } = req.params;

  try {
    const board = await redo(boardId);
    res.json({ message: 'Redo applied successfully', board });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: 'Could not redo', error: error.message });
  }
});

router.delete('/boards/:id', deleteBoard)


export default router;
