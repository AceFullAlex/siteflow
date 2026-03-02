import { GoogleGenAI } from '@google/genai';

export const getAi = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY environment variable');
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};
export const geminiModel = 'gemini-2.5-flash';
