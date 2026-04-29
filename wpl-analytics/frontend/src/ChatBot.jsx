import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const API_URL = 'http://localhost:5000';

function ChatBot({ selectedPlayer }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Hi! I am your WPL Analytics Assistant. Ask me about player performance, statistics, or predictions!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Prepare response based on query and selected player
      let response = '';

      if (!selectedPlayer) {
        response =
          'Please select a player first to get detailed information about them!';
      } else {
        const query = input.toLowerCase();

        // Simple response logic
        if (
          query.includes('average') ||
          query.includes('avg') ||
          query.includes('batting')
        ) {
          const avgData = selectedPlayer.seasonal_stats;
          const seasons = Object.entries(avgData)
            .map(
              ([s, d]) => `Season ${s}: ${d.avg} average (${d.runs} runs in ${d.matches} matches)`
            )
            .join(' | ');
          response = `${selectedPlayer.name}'s batting averages: ${seasons}`;
        } else if (
          query.includes('strike') ||
          query.includes('sr')
        ) {
          const srData = selectedPlayer.seasonal_stats;
          const seasons = Object.entries(srData)
            .map(([s, d]) => `Season ${s}: ${d.sr}`)
            .join(' | ');
          response = `${selectedPlayer.name}'s strike rates: ${seasons}`;
        } else if (query.includes('runs') || query.includes('score')) {
          const runsData = selectedPlayer.seasonal_stats;
          const totalRuns = Object.values(runsData).reduce((sum, d) => sum + d.runs, 0);
          response = `${selectedPlayer.name} scored ${totalRuns} total runs across all seasons.`;
        } else if (query.includes('team')) {
          response = `${selectedPlayer.name} plays for ${selectedPlayer.team} as a ${selectedPlayer.role}.`;
        } else if (query.includes('matches')) {
          const matchesData = selectedPlayer.seasonal_stats;
          const totalMatches = Object.values(matchesData).reduce((sum, d) => sum + d.matches, 0);
          response = `${selectedPlayer.name} has played ${totalMatches} matches in total.`;
        } else {
          response = `I'm analyzing ${selectedPlayer.name}'s performance. Ask me about their average, strike rate, runs, team, or matches!`;
        }
      }

      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        role: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        role: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>🤖 Analytics Assistant</h3>
        {selectedPlayer && <p>{selectedPlayer.name}</p>}
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.role}`}>
            <div className="message-bubble">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-bot">
            <div className="message-bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedPlayer
              ? `Ask about ${selectedPlayer.name}...`
              : 'Select a player first...'
          }
          disabled={!selectedPlayer || loading}
          className="chatbot-input"
        />
        <button
          type="submit"
          disabled={!selectedPlayer || loading}
          className="chatbot-send"
        >
          📤
        </button>
      </form>
    </div>
  );
}

export default ChatBot;