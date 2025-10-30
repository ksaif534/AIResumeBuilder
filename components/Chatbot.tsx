
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center font-bold text-sm">
          AI
        </div>
      )}
      <div className={`flex flex-col gap-1 w-full max-w-[320px] ${isUser ? 'items-end' : ''}`}>
        <div className={`flex flex-col leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${isUser ? 'bg-indigo-600 rounded-ss-xl rounded-se-none' : 'bg-gray-700'}`}>
          <p className="text-sm font-normal text-white">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        chatSessionRef.current = createChatSession(messages);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatSessionRef.current) return;
    
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const chat = chatSessionRef.current;
        // FIX: The `sendMessage` method expects an object with a `message` property, not just a string.
        const response = await chat.sendMessage({ message: userMessage.text });
        
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.182-2.319a9.76 9.76 0 01-.388-2.531C3.75 7.444 7.78 3.75 12.75 3.75c4.97 0 9 3.694 9 8.25v.75Z" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-full max-w-sm h-[60vh] bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold text-lg text-white">AI Career Assistant</h3>
          </div>
          <div ref={chatBodyRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.length === 0 && (
                <div className="text-center text-gray-400">
                    Ask me anything about resumes, cover letters, or interviews!
                </div>
            )}
            {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
            {isLoading && <ChatBubble message={{role: 'model', text: 'Thinking...'}}/>}
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
