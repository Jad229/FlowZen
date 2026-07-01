import express from 'express';

const router = express.Router();

// Placeholder root API route. Replace or extend with board/command/undo routes later.
router.get('/', (req, res) => {
  res.json({ message: 'FlowZen API' });
});

export default router;
