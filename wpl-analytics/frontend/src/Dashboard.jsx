import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import PlayerChart from './PlayerChart';
import ChatBot from './ChatBot';

const API_URL = 'http://localhost:5000';

function Dashboard() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      setPlayers(response.data);
      console.log(`✅ Loaded ${response.data.length} players`);
    } catch (error) {
      console.error('Error fetching players:', error);
      alert('Failed to load players. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🏏 WPL Player Analytics</h1>
        <p>Performance Analysis & Predictions</p>
      </header>

      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="player-list">
            {loading ? (
              <p className="loading">Loading players...</p>
            ) : filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <div
                  key={player.player_id}
                  className={`player-card ${
                    selectedPlayer?.player_id === player.player_id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <h3>{player.name}</h3>
                  <p>{player.team} • {player.role}</p>
                </div>
              ))
            ) : (
              <p className="no-results">No players found</p>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {selectedPlayer ? (
            <div className="player-details">
              <h2>{selectedPlayer.name}</h2>
              <p className="player-info">
                {selectedPlayer.team} • {selectedPlayer.role}
              </p>
              <PlayerChart player={selectedPlayer} />
              <div className="stats-title">
                <h3>Seasonal Statistics</h3>
              </div>
              <div className="stats-grid">
                {Object.entries(selectedPlayer.seasonal_stats || {})
                  .sort((a, b) => b[0] - a[0])
                  .map(([season, stats]) => (
                    <div key={season} className="stat-card">
                      <div className="season-header">Season {season}</div>
                      <div className="stat-item">
                        <span>Matches</span>
                        <strong>{stats.matches}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Runs</span>
                        <strong>{stats.runs}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Average</span>
                        <strong>{stats.avg}</strong>
                      </div>
                      <div className="stat-item">
                        <span>Strike Rate</span>
                        <strong>{stats.sr}</strong>
                      </div>
                      {stats.wickets > 0 && (
                        <div className="stat-item">
                          <span>Wickets</span>
                          <strong>{stats.wickets}</strong>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>👈 Select a player to view their statistics</p>
            </div>
          )}
        </main>

        {/* Right Chatbot */}
        <aside className="chatbot-sidebar">
          <ChatBot selectedPlayer={selectedPlayer} />
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;