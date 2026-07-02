import express from 'express';
import { query, transaction } from '../../db/db.js';

const router = express.Router();

// Placeholder root API route. Replace or extend with board/command/undo routes later.
router.get('/', (req, res) => {
  res.json({ message: 'FlowZen API' });
});

router.get('/boards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM boards WHERE id = $1', [id])
    res.json({ message: 'Board fetched successfully', board: result.rows[0] })
  } catch (error) {
    res.json({ message: 'An error occurred, could not fetch board', error })
  }
})

router.post('/boards', async (req, res) => {
  const { name } = req.body;

  try {
    const result = await transaction(async (tx) => {
      const boardQuery = await tx.query('INSERT INTO boards (name) VALUES ($1) RETURNING *', [name])
      const board = boardQuery.rows[0]

      await tx.query('INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3)', [board.id, 'To Do', 1])
      await tx.query('INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3)', [board.id, 'In Progress', 2])
      await tx.query('INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3)', [board.id, 'Done', 3])

      return board
    })

    res.json({
      message: 'Board created successfully', board: result
    })

  } catch (error) {
    res.json({ message: 'An error occurred, could not create board', error })
  }
})

export default router;
