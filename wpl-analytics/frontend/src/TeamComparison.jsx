import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeamComparison.css';

const TeamComparison = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/teams`);
      setTeams(response.data);
      if (response.data.length >= 2) {
        setSelectedTeam1(response.data[0]);
        setSelectedTeam2(response.data[1]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleCompare = async () => {
    if (!selectedTeam1 || !selectedTeam2) {
      alert('Please select two teams');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/teams/compare/${encodeURIComponent(selectedTeam1)}/${encodeURIComponent(
          selectedTeam2
        )}`
      );
      setComparison(response.data);
    } catch (err) {
      console.error('Error comparing teams:', err);
      alert('Error comparing teams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-comparison">
      <div className="comparison-header">
        <h1>⚔️ Team Comparison</h1>
        <p>Compare two teams head-to-head</p>
      </div>

      <div className="team-selector">
        <div className="selector-group">
          <label>Team 1</label>
          <select value={selectedTeam1} onChange={(e) => setSelectedTeam1(e.target.value)}>
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <button className="compare-btn" onClick={handleCompare} disabled={loading}>
          {loading ? 'Comparing...' : 'Compare'}
        </button>

        <div className="selector-group">
          <label>Team 2</label>
          <select value={selectedTeam2} onChange={(e) => setSelectedTeam2(e.target.value)}>
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
      </div>

      {comparison && (
        <div className="comparison-results">
          <div className="team-card">
            <h2>{comparison.team1.teamName}</h2>
            <div className="stats-grid">
              <div className="stat">
                <label>Players</label>
                <p>{comparison.team1.players}</p>
              </div>
              <div className="stat">
                <label>Total Runs</label>
                <p>{comparison.team1.totalRuns}</p>
              </div>
              <div className="stat">
                <label>Total Wickets</label>
                <p>{comparison.team1.totalWickets}</p>
              </div>
              <div className="stat">
                <label>Avg Average</label>
                <p>{comparison.team1.avgAverage}</p>
              </div>
              <div className="stat">
                <label>Avg Strike Rate</label>
                <p>{comparison.team1.avgStrikeRate}</p>
              </div>
            </div>

            {comparison.team1.topRunScorer && (
              <div className="top-player">
                <h4>Top Run Scorer</h4>
                <p>{comparison.team1.topRunScorer.name}</p>
                <p>{comparison.team1.topRunScorer.totalRuns} runs</p>
              </div>
            )}

            {comparison.team1.topWicketTaker && (
              <div className="top-player">
                <h4>Top Wicket Taker</h4>
                <p>{comparison.team1.topWicketTaker.name}</p>
                <p>{comparison.team1.topWicketTaker.wickets} wickets</p>
              </div>
            )}
          </div>

          <div className="vs-divider">VS</div>

          <div className="team-card">
            <h2>{comparison.team2.teamName}</h2>
            <div className="stats-grid">
              <div className="stat">
                <label>Players</label>
                <p>{comparison.team2.players}</p>
              </div>
              <div className="stat">
                <label>Total Runs</label>
                <p>{comparison.team2.totalRuns}</p>
              </div>
              <div className="stat">
                <label>Total Wickets</label>
                <p>{comparison.team2.totalWickets}</p>
              </div>
              <div className="stat">
                <label>Avg Average</label>
                <p>{comparison.team2.avgAverage}</p>
              </div>
              <div className="stat">
                <label>Avg Strike Rate</label>
                <p>{comparison.team2.avgStrikeRate}</p>
              </div>
            </div>

            {comparison.team2.topRunScorer && (
              <div className="top-player">
                <h4>Top Run Scorer</h4>
                <p>{comparison.team2.topRunScorer.name}</p>
                <p>{comparison.team2.topRunScorer.totalRuns} runs</p>
              </div>
            )}

            {comparison.team2.topWicketTaker && (
              <div className="top-player">
                <h4>Top Wicket Taker</h4>
                <p>{comparison.team2.topWicketTaker.name}</p>
                <p>{comparison.team2.topWicketTaker.wickets} wickets</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamComparison;