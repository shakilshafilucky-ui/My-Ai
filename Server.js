import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI Instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'active', message: 'AI Server is running smooth!' });
});

// Chat Completion API Route
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const completion = await openai.chat.completions.create({
            model: model || 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000,
        });

        const reply = completion.choices[0].message;

        res.status(200).json({
            success: true,
            data: reply,
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error',
        });
    }
});

// Server Listening
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

