import React, { useState } from 'react';

const BotInterface = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { type: 'user', content: message }]);
    
    // TODO: Implement bot response logic
    // For now, just echo back
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'bot', content: `You said: ${message}` }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="bot-interface">
      <h2>Bot Interface</h2>
      <div className="chat-container">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default BotInterface;
