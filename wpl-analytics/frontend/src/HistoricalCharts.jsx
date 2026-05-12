import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './HistoricalCharts.css';

const HistoricalCharts = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      setPlayers(response.data);
      if (response.data.length > 0) {
        setSelectedPlayer(response.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  useEffect(() => {
    if (selectedPlayer) {
      fetchPlayerData();
    }
  }, [selectedPlayer]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/players/${selectedPlayer}`);
      const player = response.data;

      // Generate mock historical data based on current stats
      const historicalData = generateHistoricalData(player);
      setPlayerData({ ...player, historicalData });
    } catch (err) {
      console.error('Error fetching player data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateHistoricalData = (player) => {
    // Create historical data for the last 10 matches/seasons
    const months = ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Match 6', 'Match 7', 'Match 8'];
    return months.map((month, idx) => ({
      match: month,
      runs: Math.max(0, Math.round(player.totalRuns / 8 + (Math.random() - 0.5) * 20)),
      average: Math.max(0, Math.round(player.average + (Math.random() - 0.5) * 10)),
      strikeRate: Math.max(0, Math.round(player.strikeRate + (Math.random() - 0.5) * 20)),
      wickets: player.role.includes('Bowler') ? Math.max(0, Math.round(player.wickets / 8 + (Math.random() - 0.5) * 2)) : 0,
    }));
  };

  const selectedPlayerData = players.find(p => p._id === selectedPlayer);

  return (
    <div className="historical-charts">
      <div className="charts-header">
        <h1>📈 Historical Charts & Trends</h1>
        <p>Track player performance over time</p>
      </div>

      <div className="player-selector">
        <label>Select Player:</label>
        <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
          {players.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name} ({player.team})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading player data...</div>
      ) : playerData ? (
        <>
          <div className="player-info">
            <div className="info-card">
              <h3>{playerData.name}</h3>
              <p><strong>Team:</strong> {playerData.team}</p>
              <p><strong>Role:</strong> {playerData.role}</p>
              <p><strong>Matches:</strong> {playerData.matches || 0}</p>
            </div>
          </div>

          <div className="charts-container">
            {/* RUNS TREND */}
            <div className="chart-wrapper">
              <h3>📊 Runs Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={playerData.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="runs" 
                    stroke="#667eea" 
                    strokeWidth={2}
                    dot={{ fill: '#667eea', r: 5 }}
                    name="Runs Scored"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AVERAGE TREND */}
            <div className="chart-wrapper">
              <h3>📈 Average Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={playerData.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#764ba2" 
                    strokeWidth={2}
                    dot={{ fill: '#764ba2', r: 5 }}
                    name="Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* STRIKE RATE TREND */}
            {!playerData.role.includes('Bowler') && (
              <div className="chart-wrapper">
                <h3>⚡ Strike Rate Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={playerData.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="strikeRate" 
                      fill="#FF9800"
                      name="Strike Rate"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* WICKETS TREND (For Bowlers) */}
            {playerData.role.includes('Bowler') && (
              <div className="chart-wrapper">
                <h3>🎯 Wickets Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={playerData.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="wickets" 
                      fill="#F44336"
                      name="Wickets"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* STATS SUMMARY */}
          <div className="stats-summary">
            <h3>📊 Career Statistics</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <label>Total Runs</label>
                <p className="stat-value">{playerData.totalRuns || 0}</p>
              </div>
              <div className="stat-box">
                <label>Matches</label>
                <p className="stat-value">{playerData.matches || 0}</p>
              </div>
              <div className="stat-box">
                <label>Average</label>
                <p className="stat-value">{playerData.average || 0}</p>
              </div>
              <div className="stat-box">
                <label>Strike Rate</label>
                <p className="stat-value">{playerData.strikeRate || 0}</p>
              </div>
              {playerData.role.includes('Bowler') && (
                <>
                  <div className="stat-box">
                    <label>Wickets</label>
                    <p className="stat-value">{playerData.wickets || 0}</p>
                  </div>
                  <div className="stat-box">
                    <label>Economy</label>
                    <p className="stat-value">{playerData.economy || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="no-data">No player data available</div>
      )}
    </div>
  );
};

export default HistoricalCharts;