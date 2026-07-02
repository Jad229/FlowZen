import express from 'express';
import { query } from '../../db/db.js';

const router = express.Router();

// Placeholder root API route. Replace or extend with board/command/undo routes later.
router.get('/', (req, res) => {
  res.json({ message: 'FlowZen API' });
});

router.get('/api/boards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM boards WHERE id = $1', [id])
    return result
  } catch (e) {
    res.json({ message: 'An error occurred, could not fetch board' })
  }
})

export default router;
