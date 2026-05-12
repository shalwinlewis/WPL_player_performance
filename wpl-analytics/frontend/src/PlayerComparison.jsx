import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './PlayerComparison.css';

const PlayerComparison = () => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      setPlayers(response.data);
      if (response.data.length >= 2) {
        setPlayer1(response.data[0]._id);
        setPlayer2(response.data[1]._id);
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  const handleCompare = async () => {
    if (!player1 || !player2) {
      alert('Please select two players');
      return;
    }

    try {
      setLoading(true);
      const [p1Response, p2Response] = await Promise.all([
        axios.get(`${API_URL}/api/players/${player1}`),
        axios.get(`${API_URL}/api/players/${player2}`),
      ]);

      const p1 = p1Response.data;
      const p2 = p2Response.data;

      // Prepare comparison data for charts
      const stats = [
        {
          stat: 'Runs',
          [p1.name]: p1.totalRuns || 0,
          [p2.name]: p2.totalRuns || 0,
        },
        {
          stat: 'Average',
          [p1.name]: Math.round(p1.average || 0),
          [p2.name]: Math.round(p2.average || 0),
        },
        {
          stat: 'Matches',
          [p1.name]: p1.matches || 0,
          [p2.name]: p2.matches || 0,
        },
        {
          stat: 'Strike Rate',
          [p1.name]: Math.round(p1.strikeRate || 0),
          [p2.name]: Math.round(p2.strikeRate || 0),
        },
        {
          stat: 'Wickets',
          [p1.name]: p1.wickets || 0,
          [p2.name]: p2.wickets || 0,
        },
      ];

      const radarData = [
        { metric: 'Runs (÷10)', p1: (p1.totalRuns || 0) / 10, p2: (p2.totalRuns || 0) / 10 },
        { metric: 'Average', p1: p1.average || 0, p2: p2.average || 0 },
        { metric: 'Matches', p1: p1.matches || 0, p2: p2.matches || 0 },
        { metric: 'Strike Rate', p1: (p1.strikeRate || 0) / 2, p2: (p2.strikeRate || 0) / 2 },
        { metric: 'Consistency', p1: Math.min(100, (p1.matches || 0) * 10), p2: Math.min(100, (p2.matches || 0) * 10) },
      ];

      setComparisonData({
        player1: p1,
        player2: p2,
        stats,
        radarData,
      });
    } catch (err) {
      console.error('Error comparing players:', err);
      alert('Error comparing players');
    } finally {
      setLoading(false);
    }
  };

  const getWinner = (p1Val, p2Val) => {
    if (!p1Val && !p2Val) return 'tie';
    if (p1Val > p2Val) return 'p1';
    if (p2Val > p1Val) return 'p2';
    return 'tie';
  };

  return (
    <div className="player-comparison">
      <div className="comparison-header">
        <h1>⚔️ Player Comparison</h1>
        <p>Compare any two players head-to-head</p>
      </div>

      <div className="comparison-selector">
        <div className="selector-group">
          <label>Player 1</label>
          <select value={player1} onChange={(e) => setPlayer1(e.target.value)}>
            <option value="">Select player</option>
            {players.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.team})
              </option>
            ))}
          </select>
        </div>

        <button className="compare-btn" onClick={handleCompare} disabled={loading}>
          {loading ? 'Comparing...' : 'Compare'}
        </button>

        <div className="selector-group">
          <label>Player 2</label>
          <select value={player2} onChange={(e) => setPlayer2(e.target.value)}>
            <option value="">Select player</option>
            {players.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.team})
              </option>
            ))}
          </select>
        </div>
      </div>

      {comparisonData && (
        <>
          {/* PLAYER CARDS */}
          <div className="player-cards">
            <div className="player-card p1">
              <h2>{comparisonData.player1.name}</h2>
              <p className="team">{comparisonData.player1.team}</p>
              <p className="role">{comparisonData.player1.role}</p>
              <div className="quick-stats">
                <div className="quick-stat">
                  <label>Runs</label>
                  <p>{comparisonData.player1.totalRuns || 0}</p>
                </div>
                <div className="quick-stat">
                  <label>Avg</label>
                  <p>{comparisonData.player1.average || 0}</p>
                </div>
                <div className="quick-stat">
                  <label>SR</label>
                  <p>{comparisonData.player1.strikeRate || 0}</p>
                </div>
              </div>
            </div>

            <div className="vs-badge">VS</div>

            <div className="player-card p2">
              <h2>{comparisonData.player2.name}</h2>
              <p className="team">{comparisonData.player2.team}</p>
              <p className="role">{comparisonData.player2.role}</p>
              <div className="quick-stats">
                <div className="quick-stat">
                  <label>Runs</label>
                  <p>{comparisonData.player2.totalRuns || 0}</p>
                </div>
                <div className="quick-stat">
                  <label>Avg</label>
                  <p>{comparisonData.player2.average || 0}</p>
                </div>
                <div className="quick-stat">
                  <label>SR</label>
                  <p>{comparisonData.player2.strikeRate || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* BAR CHART */}
          <div className="chart-section">
            <h3>📊 Statistics Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData.stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stat" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={comparisonData.player1.name} fill="#667eea" />
                <Bar dataKey={comparisonData.player2.name} fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RADAR CHART */}
          <div className="chart-section">
            <h3>🎯 Overall Performance Radar</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={comparisonData.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar 
                  name={comparisonData.player1.name} 
                  dataKey="p1" 
                  stroke="#667eea" 
                  fill="#667eea" 
                  fillOpacity={0.4}
                />
                <Radar 
                  name={comparisonData.player2.name} 
                  dataKey="p2" 
                  stroke="#764ba2" 
                  fill="#764ba2" 
                  fillOpacity={0.4}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* DETAILED COMPARISON TABLE */}
          <div className="comparison-table-container">
            <h3>📋 Detailed Stats</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th className="p1-col">{comparisonData.player1.name}</th>
                  <th className="p2-col">{comparisonData.player2.name}</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Total Runs', key: 'totalRuns' },
                  { label: 'Matches', key: 'matches' },
                  { label: 'Average', key: 'average' },
                  { label: 'Strike Rate', key: 'strikeRate' },
                  { label: 'Wickets', key: 'wickets' },
                ].map((stat) => {
                  const p1Val = comparisonData.player1[stat.key] || 0;
                  const p2Val = comparisonData.player2[stat.key] || 0;
                  const winner = getWinner(p1Val, p2Val);

                  return (
                    <tr key={stat.key}>
                      <td className="stat-label">{stat.label}</td>
                      <td className={`p1-col ${winner === 'p1' ? 'winner' : ''}`}>
                        {Math.round(p1Val)}
                      </td>
                      <td className={`p2-col ${winner === 'p2' ? 'winner' : ''}`}>
                        {Math.round(p2Val)}
                      </td>
                      <td className="winner-badge">
                        {winner === 'p1' ? '👑 P1' : winner === 'p2' ? '👑 P2' : '⚖️ Tie'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerComparison;