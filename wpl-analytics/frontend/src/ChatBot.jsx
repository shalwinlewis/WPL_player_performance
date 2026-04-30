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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

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
      let response = '';
      const query = input.toLowerCase();

      if (!selectedPlayer) {
        response = 'Please select a player first to get detailed information about them!';
      } else {
        const seasons = Object.keys(selectedPlayer.seasonal_stats).map(Number).sort((a, b) => b - a);
        const latestSeason = selectedPlayer.seasonal_stats[seasons[0]];
        const previousSeason = seasons[1] ? selectedPlayer.seasonal_stats[seasons[1]] : null;

        if (
          query.includes('average') ||
          query.includes('avg') ||
          query.includes('batting') ||
          query.includes('performance')
        ) {
          const avgChange = previousSeason
            ? ((latestSeason.avg - previousSeason.avg) / previousSeason.avg * 100).toFixed(1)
            : 'N/A';
          response = `${selectedPlayer.name}'s batting statistics:\n`;
          response += `Latest Season (${seasons[0]}): Average ${latestSeason.avg}\n`;
          response += `${avgChange !== 'N/A' ? `Change from previous: ${avgChange}%\n` : ''}`;
          response += `All Seasons: ${Object.entries(selectedPlayer.seasonal_stats)
            .map(([s, d]) => `${s}: ${d.avg}`)
            .join(', ')}`;
        } else if (query.includes('strike') || query.includes('sr')) {
          response = `${selectedPlayer.name}'s strike rate statistics:\n`;
          response += `Latest: ${latestSeason.sr}\n`;
          response += `All Seasons: ${Object.entries(selectedPlayer.seasonal_stats)
            .map(([s, d]) => `${s}: ${d.sr}`)
            .join(', ')}`;
        } else if (query.includes('runs') || query.includes('score')) {
          const totalRuns = Object.values(selectedPlayer.seasonal_stats).reduce(
            (sum, d) => sum + d.runs,
            0
          );
          const avgRuns = (totalRuns / Object.keys(selectedPlayer.seasonal_stats).length).toFixed(0);
          response = `${selectedPlayer.name} scoring statistics:\n`;
          response += `Total Career Runs: ${totalRuns}\n`;
          response += `Average per Season: ${avgRuns}\n`;
          response += `Latest Season (${seasons[0]}): ${latestSeason.runs} runs`;
        } else if (query.includes('team') || query.includes('which team')) {
          response = `${selectedPlayer.name} details:\n`;
          response += `Team: ${selectedPlayer.team}\n`;
          response += `Role: ${selectedPlayer.role}\n`;
          response += `Playing style: ${selectedPlayer.role.includes('Batter') ? 'Batsman' : 'All-rounder'}`;
        } else if (query.includes('matches') || query.includes('how many')) {
          const totalMatches = Object.values(selectedPlayer.seasonal_stats).reduce(
            (sum, d) => sum + d.matches,
            0
          );
          response = `${selectedPlayer.name}'s match statistics:\n`;
          response += `Total Matches: ${totalMatches}\n`;
          response += `Latest Season (${seasons[0]}): ${latestSeason.matches} matches\n`;
          response += `Matches by season: ${Object.entries(selectedPlayer.seasonal_stats)
            .map(([s, d]) => `${s}: ${d.matches}`)
            .join(', ')}`;
        } else if (query.includes('best') || query.includes('peak')) {
          const bestSeason = Object.entries(selectedPlayer.seasonal_stats).reduce((a, b) =>
            a[1].avg > b[1].avg ? a : b
          );
          response = `${selectedPlayer.name}'s best season was ${bestSeason[0]} with an average of ${bestSeason[1].avg}!`;
        } else if (query.includes('compare') || query.includes('versus')) {
          response = `To compare ${selectedPlayer.name} with another player, use the comparison tool below the stats!`;
        } else {
          response = `I can help you with information about ${selectedPlayer.name}. Try asking about:\n`;
          response += `• Average or batting performance\n`;
          response += `• Strike rate\n`;
          response += `• Runs scored\n`;
          response += `• Team and role\n`;
          response += `• Match statistics\n`;
          response += `• Best season or peak performance`;
        }
      }

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

      {/* Quick Suggestion Buttons */}
      <div className="chatbot-suggestions">
        <p>Quick questions:</p>
        <div className="suggestion-buttons">
          {selectedPlayer && [
            { text: "What's the average?", query: "What's the average?" },
            { text: 'Show strike rate', query: 'Show strike rate' },
            { text: 'How many runs?', query: 'How many runs?' },
            { text: 'Best season?', query: "What's the best season?" },
          ].map((btn, idx) => (
            <button
              key={idx}
              className="suggestion-btn"
              onClick={(e) => {
                e.preventDefault();
                setInput(btn.query);
              }}
            >
              {btn.text}
            </button>
          ))}
        </div>
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