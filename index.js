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
    res.json({ status: 'ok' });
});

// Chat completion endpoint
app.post('/v1/chat/completions', async (req, res) => {
    try {
        console.log('Received chat completion request:', JSON.stringify(req.body, null, 2));
        
        const {
            messages,
            model = 'gpt-3.5-turbo',
            max_tokens,
            temperature = 0.7,
            ...otherParams
        } = req.body;

        // Validate required parameters
        if (!messages || !Array.isArray(messages)) {
            console.error('Invalid request: messages array is missing or invalid');
            return res.status(400).json({
                error: {
                    message: 'Messages array is required',
                    type: 'invalid_request_error'
                }
            });
        }

        console.log('Calling OpenAI API with params:', {
            model,
            messageCount: messages.length,
            max_tokens,
            temperature
        });

        // Create completion with validated parameters
        const response = await openai.chat.completions.create({
            model,
            messages,
            max_tokens: max_tokens || undefined,
            temperature,
            ...otherParams
        });

        console.log('OpenAI API response received');
        res.json(response);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({
            error: {
                message: error.message,
                type: error.type,
                code: error.code
            }
        });
    }
});

// Start server
app.listen(5000, '0.0.0.0', () => {
    console.log(`OpenAI Proxy server running on port 5000`);
    console.log('Available models: gpt-3.5-turbo, gpt-4');
    console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
}); 