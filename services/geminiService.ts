
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateContent = async (prompt: string, model: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error: Could not generate content. Please check the console for details.";
  }
};

export const generateContentWithSearch = async (prompt: string): Promise<{text: string; sources: any[]}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, sources: groundingChunks };
  } catch (error) {
    console.error("Error generating content with search:", error);
    return { text: "Error: Could not generate content with search. Please check the console for details.", sources: [] };
  }
};

export const createChatSession = (history: ChatMessage[]): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    })),
    config: {
        systemInstruction: "You are a helpful career assistant chatbot. You can answer questions about resume writing, cover letters, job searching, and interview preparation. Keep your answers encouraging, helpful, and concise."
    }
  });
};
