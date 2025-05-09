import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import axios from 'axios';
import './styles/support.css';

const Support = () => {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting when component mounts
  useEffect(() => {
    const initialMessage = {
      type: 'bot',
      content: `Hi ${auth.user?.name || 'there'}! 👋 I'm your IIIT Buy-Sell assistant. I can help you with:
    • Finding and purchasing items
    • Selling your items
    • Understanding the OTP system
    • Tracking your orders
    • General platform questions
    
What would you like to know about?`,
      timestamp: new Date(),
      isGreeting: true
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Format chat history properly for Gemini AI
      const chatHistory = messages
        .filter(msg => !msg.isGreeting)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          content: msg.content
        }));

      const response = await axios.post('http://localhost:8000/api/support/chat', {
        message: {
          role: 'user',
          content: inputMessage
        },
        context: chatHistory
      });

      const botMessage = {
        type: 'bot',
        content: response.data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get chatbot response:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="support-container">
        <div className="chat-header">
          <h2>Customer Support</h2>
          <p>Ask me anything about the IIIT Buy-Sell platform!</p>
        </div>

        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Support;