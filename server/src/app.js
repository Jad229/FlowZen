import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

const app = express();

// Allow the frontend (running on a different origin/port) to call this API.
app.use(cors());

// Parse incoming JSON request bodies and attach them to req.body.
app.use(express.json());

// Mount all API routes under /api (e.g. GET /api/ → routes/index.js).
app.use('/api', apiRouter);

// Catch-all for requests that did not match any route above.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler 
// Any route or middleware can call next(err) to forward errors here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

export default app;
