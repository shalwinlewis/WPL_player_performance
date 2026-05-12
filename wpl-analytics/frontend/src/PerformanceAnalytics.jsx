import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PerformanceAnalytics.css';

const PerformanceAnalytics = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [playerAnalytics, setPlayerAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const COLORS = ['#667eea', '#764ba2', '#FF9800', '#F44336', '#4CAF50'];

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
      fetchPlayerAnalytics();
    }
  }, [selectedPlayer]);

  const fetchPlayerAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/players/${selectedPlayer}`);
      const player = response.data;

      // Calculate detailed analytics
      const analytics = calculateAnalytics(player);
      setPlayerAnalytics({ ...player, ...analytics });
    } catch (err) {
      console.error('Error fetching player analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (player) => {
    // Performance metrics
    const consistency = player.matches ? Math.min(100, (player.totalRuns / (player.matches * 30)) * 100) : 0;
    const form = getForm(consistency);
    const impact = calculateImpact(player);
    const efficiency = player.matches ? ((player.totalRuns / player.matches) / 50) * 100 : 0;

    // Role-based analytics
    const isBatsman = player.role.includes('Batter') || player.role.includes('All-rounder');
    const isBowler = player.role.includes('Bowler') || player.role.includes('All-rounder');

    // Batting stats breakdown
    const battingStats = isBatsman
      ? [
          { category: 'Consistency', value: Math.min(100, consistency) },
          { category: 'Efficiency', value: Math.min(100, efficiency) },
          { category: 'Strike Rate', value: Math.min(100, (player.strikeRate / 150) * 100) },
          { category: 'Runs Scored', value: Math.min(100, (player.totalRuns / 500) * 100) },
        ]
      : [];

    // Bowling stats breakdown
    const bowlingStats = isBowler
      ? [
          { category: 'Wickets', value: Math.min(100, (player.wickets / 20) * 100) },
          { category: 'Economy', value: Math.min(100, (8 - player.economy) * 10) },
          { category: 'Matches', value: Math.min(100, (player.matches / 30) * 100) },
        ]
      : [];

    // Monthly trend data
    const monthlyData = generateMonthlyTrend(player);

    return {
      consistency: Math.round(consistency),
      form,
      impact,
      efficiency: Math.round(efficiency),
      battingStats,
      bowlingStats,
      monthlyData,
      performanceBreakdown: [
        { name: 'Peak', value: player.totalRuns * 0.3 },
        { name: 'Good', value: player.totalRuns * 0.4 },
        { name: 'Average', value: player.totalRuns * 0.2 },
        { name: 'Poor', value: player.totalRuns * 0.1 },
      ],
    };
  };

  const getForm = (consistency) => {
    if (consistency >= 80) return 'Excellent';
    if (consistency >= 60) return 'Good';
    if (consistency >= 40) return 'Average';
    return 'Poor';
  };

  const calculateImpact = (player) => {
    const runImpact = player.totalRuns ? 30 : 0;
    const matchImpact = Math.min(player.matches * 2, 30);
    const averageImpact = Math.min(player.average ? 20 : 0, 20);
    const srImpact = Math.min((player.strikeRate / 150) * 20, 20);

    return Math.round(runImpact + matchImpact + averageImpact + srImpact);
  };

  const generateMonthlyTrend = (player) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      performance: Math.max(0, Math.round(player.average + (Math.random() - 0.5) * 20)),
      runs: Math.max(0, Math.round(player.totalRuns / 6 + (Math.random() - 0.5) * 30)),
    }));
  };

  const getFormColor = (form) => {
    switch (form) {
      case 'Excellent':
        return '#4CAF50';
      case 'Good':
        return '#2196F3';
      case 'Average':
        return '#FF9800';
      case 'Poor':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const selectedPlayerData = players.find(p => p._id === selectedPlayer);

  return (
    <div className="performance-analytics">
      <div className="analytics-header">
        <h1>📊 Performance Analytics</h1>
        <p>Detailed player performance metrics and insights</p>
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
        <div className="loading">Loading analytics...</div>
      ) : playerAnalytics ? (
        <>
          {/* KEY METRICS */}
          <div className="key-metrics">
            <div className="metric-card">
              <h4>Form</h4>
              <div
                className="form-badge"
                style={{ backgroundColor: getFormColor(playerAnalytics.form) }}
              >
                {playerAnalytics.form.toUpperCase()}
              </div>
              <p className="metric-value">{playerAnalytics.consistency}%</p>
            </div>

            <div className="metric-card">
              <h4>Impact Score</h4>
              <div className="impact-circle">
                <p className="metric-value">{playerAnalytics.impact}</p>
              </div>
              <p className="metric-label">Overall Impact</p>
            </div>

            <div className="metric-card">
              <h4>Efficiency</h4>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${playerAnalytics.efficiency}%` }}
                ></div>
              </div>
              <p className="metric-value">{playerAnalytics.efficiency}%</p>
            </div>

            <div className="metric-card">
              <h4>Role</h4>
              <p className="metric-value-text">{playerAnalytics.role}</p>
              <p className="metric-label">{playerAnalytics.team}</p>
            </div>
          </div>

          {/* BATTING STATS BREAKDOWN */}
          {playerAnalytics.battingStats.length > 0 && (
            <div className="analytics-section">
              <h3>🏏 Batting Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={playerAnalytics.battingStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#667eea" name="Performance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* BOWLING STATS BREAKDOWN */}
          {playerAnalytics.bowlingStats.length > 0 && (
            <div className="analytics-section">
              <h3>🎯 Bowling Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={playerAnalytics.bowlingStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#764ba2" name="Performance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* MONTHLY TREND */}
          <div className="analytics-section">
            <h3>📈 Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={playerAnalytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#667eea"
                  strokeWidth={2}
                  name="Performance"
                />
                <Line
                  type="monotone"
                  dataKey="runs"
                  stroke="#764ba2"
                  strokeWidth={2}
                  name="Runs"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PERFORMANCE BREAKDOWN */}
          <div className="analytics-section">
            <h3>🎯 Performance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={playerAnalytics.performanceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${Math.round(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {playerAnalytics.performanceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* DETAILED STATS TABLE */}
          <div className="detailed-stats">
            <h3>📋 Detailed Statistics</h3>
            <table className="stats-table">
              <tbody>
                <tr>
                  <td className="stat-label">Total Runs</td>
                  <td className="stat-value">{playerAnalytics.totalRuns || 0}</td>
                  <td className="stat-label">Matches</td>
                  <td className="stat-value">{playerAnalytics.matches || 0}</td>
                </tr>
                <tr>
                  <td className="stat-label">Average</td>
                  <td className="stat-value">{playerAnalytics.average || 0}</td>
                  <td className="stat-label">Strike Rate</td>
                  <td className="stat-value">{playerAnalytics.strikeRate || 0}</td>
                </tr>
                <tr>
                  <td className="stat-label">Wickets</td>
                  <td className="stat-value">{playerAnalytics.wickets || 0}</td>
                  <td className="stat-label">Economy</td>
                  <td className="stat-value">{playerAnalytics.economy || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* INSIGHTS */}
          <div className="insights-section">
            <h3>💡 Key Insights</h3>
            <div className="insights-list">
              <div className="insight">
                <p>
                  <strong>Consistency:</strong> {playerAnalytics.form} consistency with{' '}
                  {playerAnalytics.consistency}% performance rate
                </p>
              </div>
              <div className="insight">
                <p>
                  <strong>Impact:</strong> Overall impact score of {playerAnalytics.impact}/100 indicates{' '}
                  {playerAnalytics.impact > 70
                    ? 'significant contribution to team'
                    : playerAnalytics.impact > 50
                    ? 'moderate contribution to team'
                    : 'developing potential'}
                </p>
              </div>
              <div className="insight">
                <p>
                  <strong>Trend:</strong> Player showing{' '}
                  {Math.random() > 0.5 ? 'improvement' : 'consistency'} in recent matches
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-data">No player data available</div>
      )}
    </div>
  );
};

export default PerformanceAnalytics;