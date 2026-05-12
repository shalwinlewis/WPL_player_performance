import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RankingsPage.css';

const RankingsPage = () => {
  const [rankings, setRankings] = useState([]);
  const [category, setCategory] = useState('batsmen-runs');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const categories = [
    { value: 'batsmen-runs', label: '🏏 Top Batsmen (Runs)' },
    { value: 'batsmen-average', label: '📊 Top Batsmen (Average)' },
    { value: 'bowlers-wickets', label: '🎯 Top Bowlers (Wickets)' },
    { value: 'bowlers-economy', label: '💰 Best Economy Rate' },
    { value: 'strikeRate', label: '⚡ Highest Strike Rate' },
    { value: 'overall', label: '🏆 Overall Rankings' },
  ];

  useEffect(() => {
    fetchRankings();
  }, [category]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      let endpoint = '';

      switch (category) {
        case 'batsmen-runs':
          endpoint = '/api/rankings/batsmen/runs';
          break;
        case 'batsmen-average':
          endpoint = '/api/rankings/batsmen/average';
          break;
        case 'bowlers-wickets':
          endpoint = '/api/rankings/bowlers/wickets';
          break;
        case 'bowlers-economy':
          endpoint = '/api/rankings/bowlers/economy';
          break;
        case 'strikeRate':
          endpoint = '/api/rankings/strikeRate';
          break;
        case 'overall':
          endpoint = '/api/rankings/overall';
          break;
        default:
          endpoint = '/api/rankings/batsmen/runs';
      }

      const response = await axios.get(`${API_URL}${endpoint}`);
      setRankings(response.data);
    } catch (err) {
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankingColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#f0f0f0';
  };

  return (
    <div className="rankings-page">
      <div className="rankings-header">
        <h1>🏆 Player Rankings</h1>
        <p>See who's leading in different categories</p>
      </div>

      <div className="category-selector">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`category-btn ${category === cat.value ? 'active' : ''}`}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading rankings...</div>
      ) : rankings.length === 0 ? (
        <div className="no-data">No rankings available</div>
      ) : (
        <div className="rankings-table-container">
          <table className="rankings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player Name</th>
                <th>Team</th>
                {category.includes('batsmen') || category === 'strikeRate' || category === 'overall' ? (
                  <>
                    <th>Runs</th>
                    {category !== 'strikeRate' && <th>Average</th>}
                  </>
                ) : (
                  <>
                    <th>Wickets</th>
                    {category === 'bowlers-economy' && <th>Economy</th>}
                  </>
                )}
                {category === 'overall' && <th>Overall Score</th>}
                {category === 'strikeRate' && <th>Strike Rate</th>}
              </tr>
            </thead>
            <tbody>
              {rankings.map((player) => (
                <tr key={player.rank} style={{ backgroundColor: getRankingColor(player.rank) }}>
                  <td className="rank-badge">
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                  </td>
                  <td className="player-name">{player.name}</td>
                  <td>{player.team}</td>
                  {category.includes('batsmen') || category === 'strikeRate' || category === 'overall' ? (
                    <>
                      <td>{player.runs || player.totalRuns || '-'}</td>
                      {category !== 'strikeRate' && <td>{player.average || '-'}</td>}
                    </>
                  ) : (
                    <>
                      <td>{player.wickets || '-'}</td>
                      {category === 'bowlers-economy' && <td>{player.economy || '-'}</td>}
                    </>
                  )}
                  {category === 'overall' && <td className="score">{player.overallScore}</td>}
                  {category === 'strikeRate' && <td className="score">{player.strikeRate}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RankingsPage;