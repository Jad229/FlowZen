// Load environment variables from .env into process.env before anything else runs.
import 'dotenv/config';
import app from './app.js';

// Use PORT from .env if set, otherwise fall back to 3001.
const PORT = process.env.PORT || 3001;

// Start the HTTP server and listen for incoming requests.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
