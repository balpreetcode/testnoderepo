// filename: server-get.js
const express = require('express');
const app = express();
const PORT = 3000;

// Prometheus client setup
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom counter metric
const messagesCounter = new client.Counter({
  name: 'api_messages_requests_total',
  help: 'Total number of /api/messages requests',
});
register.registerMetric(messagesCounter);

// Middleware to parse JSON
app.use(express.json());

// Simple in-memory array for demo
const messages = [
  { id: 1, text: 'Hello, world!' },
  { id: 2, text: 'Hi there!' }
];

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the API! Visit /api/messages to see messages.'
  });
});

// Users route
app.get('/users', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the users route.'
  });
});

// GET endpoint to fetch all messages
app.get('/api/messages', (req, res) => {
  messagesCounter.inc(); // Increment Prometheus counter
  res.json({
    success: true,
    data: messages
  });
});

// Echo endpoint
app.post('/api/echo', (req, res) => {
  const payload = req.body;
  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Request body is empty'
    });
  }

  res.json({
    success: true,
    received: payload
  });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`GET-server listening on http://localhost:${PORT}`);
});
