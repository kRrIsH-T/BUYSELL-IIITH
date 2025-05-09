import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env file from the backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY); // Use process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define system prompt
const systemPrompt = `You are a helpful assistant for the IIIT Buy-Sell platform. You help users with:
- Finding and purchasing items
- Selling items on the platform
- Understanding the OTP system for deliveries
- Tracking orders and delivery status
- General platform navigation and usage
- Answering questions about the platform features

Please provide clear, concise responses and guide users to the appropriate sections of the platform when relevant.`;

export const handleChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    const prompt = {
      role: 'user',
      parts: [{ text: systemPrompt }]
    };

    const result = await model.generateContent({
      contents: [
        prompt,
        ...context.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: message.content }]
        }
      ]
    });

    const response = await result.response;
    res.json({ reply: response.text() });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to get chatbot response',
      details: error.message 
    });
  }
};