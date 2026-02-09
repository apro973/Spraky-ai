import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import { getGeminiChat } from './services/geminiService.js';
import Header from './components/Header.js';
import ChatWindow from './components/ChatWindow.js';
import ChatInput from './components/ChatInput.js';

const html = htm.bind(React.createElement);

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'model',
      text: "Hi there! I'm Sparky! 🌟 I'm so happy to meet you! We can learn together, tell stories, or just chat. What would you like to do today? 😊",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current = getGeminiChat();
  }, []);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      if (!chatRef.current) {
        chatRef.current = getGeminiChat();
      }

      const response = await chatRef.current.sendMessage({ message: text });
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "Oops! My magic wand flickered. Can you say that again? 😊",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Oh no! My circuits got a little tickle. Let's try again! 🌈",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "Fresh start! 🌈 What should we explore now? 🚀",
      timestamp: new Date()
    }]);
    chatRef.current = getGeminiChat();
  };

  return html`
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-xl overflow-hidden border-x border-sky-100">
      <${Header} onClear=${handleClearChat} />
      
      <main className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-sky-50 to-white">
        <${ChatWindow} messages=${messages} isTyping=${isTyping} />
      </main>

      <footer className="p-4 bg-white border-t border-sky-100">
        <${ChatInput} onSend=${handleSendMessage} disabled=${isTyping} />
      </footer>
    </div>
  `;
};

export default App;