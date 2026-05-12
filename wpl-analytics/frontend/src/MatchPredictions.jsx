import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MatchPredictions.css';

const MatchPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [predictedMatch, setPredictedMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTeams();
    fetchPredictions();
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

  const fetchPredictions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/predictions/top/performers`);
      setPredictions(response.data);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    }
  };

  const handlePredictMatch = async () => {
    if (!selectedTeam1 || !selectedTeam2) {
      alert('Please select two teams');
      return;
    }

    if (selectedTeam1 === selectedTeam2) {
      alert('Please select different teams');
      return;
    }

    try {
      setLoading(true);

      // Get team comparisons to predict winner
      const comparisonResponse = await axios.get(
        `${API_URL}/api/teams/compare/${encodeURIComponent(selectedTeam1)}/${encodeURIComponent(selectedTeam2)}`
      );

      const comparison = comparisonResponse.data;
      const team1Stats = comparison.team1;
      const team2Stats = comparison.team2;

      // Calculate win probability based on team stats
      const team1Score = calculateTeamScore(team1Stats);
      const team2Score = calculateTeamScore(team2Stats);
      const totalScore = team1Score + team2Score;

      const team1WinProb = Math.round((team1Score / totalScore) * 100);
      const team2WinProb = 100 - team1WinProb;

      // Get top players from each team
      const team1TopPlayer = team1Stats.topRunScorer;
      const team2TopPlayer = team2Stats.topRunScorer;

      const prediction = {
        team1: selectedTeam1,
        team2: selectedTeam2,
        team1WinProbability: team1WinProb,
        team2WinProbability: team2WinProb,
        predictedWinner: team1WinProb > team2WinProb ? selectedTeam1 : selectedTeam2,
        team1Stats,
        team2Stats,
        team1TopPlayer,
        team2TopPlayer,
        matchQuality: calculateMatchQuality(team1Stats, team2Stats),
        predictedToss: Math.random() > 0.5 ? selectedTeam1 : selectedTeam2,
      };

      setPredictedMatch(prediction);
    } catch (err) {
      console.error('Error predicting match:', err);
      alert('Error predicting match');
    } finally {
      setLoading(false);
    }
  };

  const calculateTeamScore = (teamStats) => {
    const runScore = (teamStats.totalRuns || 0) / 100;
    const playerScore = (teamStats.players || 0) * 10;
    const avgScore = (teamStats.avgAverage || 0) * 5;
    const srScore = (teamStats.avgStrikeRate || 0) / 5;

    return runScore + playerScore + avgScore + srScore;
  };

  const calculateMatchQuality = (team1Stats, team2Stats) => {
    const balance = Math.min(
      Math.abs((team1Stats.totalRuns || 0) - (team2Stats.totalRuns || 0)) / 100,
      10
    );
    const quality = 10 - balance;
    return quality > 5 ? 'Competitive' : 'One-sided';
  };

  return (
    <div className="match-predictions">
      <div className="predictions-header">
        <h1>🏆 Match Predictions</h1>
        <p>AI-powered predictions for upcoming matches</p>
      </div>

      <div className="prediction-selector">
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

        <button className="predict-btn" onClick={handlePredictMatch} disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Match'}
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

      {predictedMatch && (
        <>
          {/* MATCH OVERVIEW */}
          <div className="match-overview">
            <div className="match-card">
              <h2>{predictedMatch.team1}</h2>
              <div className="win-probability">
                <div className="probability-bar">
                  <div
                    className="probability-fill"
                    style={{ width: `${predictedMatch.team1WinProbability}%` }}
                  ></div>
                </div>
                <p className="probability-text">
                  {predictedMatch.team1WinProbability}% Win Chance
                </p>
              </div>
            </div>

            <div className="vs-section">
              <h3>VS</h3>
              <div className="match-details">
                <p><strong>Predicted Winner:</strong> {predictedMatch.predictedWinner} 👑</p>
                <p><strong>Match Quality:</strong> {predictedMatch.matchQuality}</p>
                <p><strong>Predicted Toss Winner:</strong> {predictedMatch.predictedToss}</p>
              </div>
            </div>

            <div className="match-card">
              <h2>{predictedMatch.team2}</h2>
              <div className="win-probability">
                <div className="probability-bar">
                  <div
                    className="probability-fill"
                    style={{ width: `${predictedMatch.team2WinProbability}%` }}
                  ></div>
                </div>
                <p className="probability-text">
                  {predictedMatch.team2WinProbability}% Win Chance
                </p>
              </div>
            </div>
          </div>

          {/* KEY PLAYERS */}
          <div className="key-players">
            <h3>⭐ Key Players</h3>
            <div className="players-grid">
              {predictedMatch.team1TopPlayer && (
                <div className="key-player-card">
                  <h4>{predictedMatch.team1} Star Player</h4>
                  <p className="player-name">{predictedMatch.team1TopPlayer.name}</p>
                  <p className="player-stat">{predictedMatch.team1TopPlayer.totalRuns} Runs</p>
                </div>
              )}

              {predictedMatch.team2TopPlayer && (
                <div className="key-player-card">
                  <h4>{predictedMatch.team2} Star Player</h4>
                  <p className="player-name">{predictedMatch.team2TopPlayer.name}</p>
                  <p className="player-stat">{predictedMatch.team2TopPlayer.totalRuns} Runs</p>
                </div>
              )}
            </div>
          </div>

          {/* TEAM STATS */}
          <div className="team-stats">
            <h3>📊 Team Statistics</h3>
            <div className="stats-comparison">
              <div className="stat-item">
                <label>Total Runs</label>
                <div className="stat-values">
                  <span>{predictedMatch.team1Stats.totalRuns || 0}</span>
                  <span>{predictedMatch.team2Stats.totalRuns || 0}</span>
                </div>
              </div>

              <div className="stat-item">
                <label>Players</label>
                <div className="stat-values">
                  <span>{predictedMatch.team1Stats.players || 0}</span>
                  <span>{predictedMatch.team2Stats.players || 0}</span>
                </div>
              </div>

              <div className="stat-item">
                <label>Avg Average</label>
                <div className="stat-values">
                  <span>{predictedMatch.team1Stats.avgAverage || 0}</span>
                  <span>{predictedMatch.team2Stats.avgAverage || 0}</span>
                </div>
              </div>

              <div className="stat-item">
                <label>Avg Strike Rate</label>
                <div className="stat-values">
                  <span>{predictedMatch.team1Stats.avgStrikeRate || 0}</span>
                  <span>{predictedMatch.team2Stats.avgStrikeRate || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PREDICTION INSIGHTS */}
          <div className="prediction-insights">
            <h3>💡 Prediction Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Strength</h4>
                <p>
                  {predictedMatch.team1Stats.totalRuns > predictedMatch.team2Stats.totalRuns
                    ? `${predictedMatch.team1} has more collective runs`
                    : `${predictedMatch.team2} has more collective runs`}
                </p>
              </div>

              <div className="insight-card">
                <h4>Form</h4>
                <p>
                  {predictedMatch.team1WinProbability > 55
                    ? `${predictedMatch.team1} in better form`
                    : predictedMatch.team2WinProbability > 55
                    ? `${predictedMatch.team2} in better form`
                    : 'Both teams in similar form'}
                </p>
              </div>

              <div className="insight-card">
                <h4>Risk Factor</h4>
                <p>
                  {Math.abs(predictedMatch.team1WinProbability - 50) > 20
                    ? 'Low risk - Clear favorite'
                    : 'High risk - Close match'}
                </p>
              </div>

              <div className="insight-card">
                <h4>Recommendation</h4>
                <p>
                  Expected close match with exciting play from key performers on both sides.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MatchPredictions;