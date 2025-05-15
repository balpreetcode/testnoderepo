// filename: server-get.js
const express = require('express');
const app = express();
const PORT = 3000;

// Simple in-memory array for demo
const messages = [
  { id: 1, text: 'Hello, world!' },
  { id: 2, text: 'Hi there!' }
];

// GET endpoint to fetch all messages
app.get('/api/messages', (req, res) => {
  res.json({
    success: true,
    data: messages
  });
});

app.post('/api/echo', (req, res) => {
  const payload = req.body;
  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Request body is empty'
    });
  }
  
  // Echo the incoming JSON
  res.json({
    success: true,
    received: payload
  });
});

app.listen(PORT, () => {
  console.log(`GET-server listening on http://localhost:${PORT}`);
});
