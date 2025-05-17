require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 5000;

// Initialize OpenAI client with API key from .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('OK');
});

// Chat completion endpoint
app.post('/v1/chat/completions', async (req, res) => {
  const { messages, model, ...rest } = req.body;

  if (!messages || !model) {
    return res.status(400).json({ error: 'Missing messages or model' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      ...rest,
    });

    res.json(completion);
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Start server
app.listen(5000, '0.0.0.0', () => {
    console.log(`OpenAI Proxy server running on port 5000`);
    console.log('Available models: gpt-3.5-turbo, gpt-4');
    console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
}); 