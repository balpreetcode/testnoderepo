// filename: server-post.js
const express = require('express');
const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to echo back posted data


app.listen(PORT, () => {
  console.log(`POST-server listening on http://localhost:${PORT}`);
});
