// filename: server.js
const express = require('express');
const promClient = require('prom-client');
const app = express();
const PORT = 3000;

// Prometheus metrics setup
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Request counter metric
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// Custom /api/messages counter
const messagesCounter = new promClient.Counter({
  name: 'api_messages_requests_total',
  help: 'Total number of /api/messages requests',
});
register.registerMetric(messagesCounter);

// Middleware to parse JSON
app.use(express.json());

// Middleware to count all HTTP requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
});

// Sample in-memory data
const messages = [
  { id: 1, text: 'Hello, world!' },
  { id: 2, text: 'Hi there!' },
];

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the API! Visit /api/messages to see messages.',
  });
});

app.get('/users', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the users route.',
  });
});

app.get('/api/messages', (req, res) => {
  messagesCounter.inc(); // Increment custom counter
  res.json({
    success: true,
    data: messages,
  });
});

app.post('/api/echo', (req, res) => {
  const payload = req.body;
  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Request body is empty',
    });
  }

  res.json({
    success: true,
    received: payload,
  });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
