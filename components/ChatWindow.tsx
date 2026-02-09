
import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="space-y-6 pb-4">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
        >
          <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`chat-bubble px-4 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-sky-500 text-white user-bubble' 
                  : 'bg-white text-gray-700 border border-sky-100 ai-bubble'
              }`}
            >
              <p className="text-md leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 mx-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start animate-pulse">
          <div className="bg-white border border-sky-100 ai-bubble px-4 py-3 shadow-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-sky-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-sky-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
