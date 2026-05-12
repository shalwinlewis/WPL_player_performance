import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebSocketService from './WebSocketService';
import './LiveMatches.css';

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [liveScore, setLiveScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMatches();
    connectWebSocket();

    return () => {
      WebSocketService.unsubscribeFromLeaderboard();
    };
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/matches`);
      setMatches(response.data);
      
      if (response.data.length > 0) {
        setSelectedMatch(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    try {
      WebSocketService.connect(API_URL);

      // Listen for connection events
      WebSocketService.on('connected', () => {
        setConnectionStatus('connected');
        console.log('✅ Connected to live updates');
      });

      WebSocketService.on('disconnected', () => {
        setConnectionStatus('disconnected');
      });

      WebSocketService.on('reconnecting', () => {
        setConnectionStatus('reconnecting');
      });

      // Listen for live score updates
      WebSocketService.onLiveScore((data) => {
        setLiveScore(data);
        setMatches((prevMatches) =>
          prevMatches.map((match) =>
            match._id === data.matchId ? { ...match, ...data } : match
          )
        );
      });

      // Listen for notifications
      WebSocketService.onNotification((notification) => {
        console.log('📢 Notification:', notification);
        // Show notification to user
        if ('Notification' in window) {
          new Notification('WPL Analytics', {
            body: notification.message,
            icon: '🏏',
          });
        }
      });
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setConnectionStatus('error');
    }
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    WebSocketService.subscribeToMatch(match._id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return '#FF6B6B';
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return '#999';
      default:
        return '#667eea';
    }
  };

  const getConnectionIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <span className="indicator connected">● Connected</span>;
      case 'disconnected':
        return <span className="indicator disconnected">● Disconnected</span>;
      case 'reconnecting':
        return <span className="indicator reconnecting">⟳ Reconnecting...</span>;
      default:
        return <span className="indicator error">✕ Error</span>;
    }
  };

  return (
    <div className="live-matches">
      <div className="matches-header">
        <div className="header-content">
          <h1>🎯 Live Matches</h1>
          <p>Real-time match updates and scores</p>
        </div>
        {getConnectionIndicator()}
      </div>

      {loading ? (
        <div className="loading">Loading matches...</div>
      ) : (
        <div className="matches-container">
          {/* MATCHES LIST */}
          <div className="matches-list">
            <h2>Available Matches</h2>
            <div className="matches-scroll">
              {matches.length === 0 ? (
                <p className="no-matches">No matches available</p>
              ) : (
                matches.map((match) => (
                  <div
                    key={match._id}
                    className={`match-card ${selectedMatch?._id === match._id ? 'active' : ''}`}
                    onClick={() => handleMatchSelect(match)}
                  >
                    <div className="match-status" style={{ backgroundColor: getStatusColor(match.status) }}>
                      {match.status.toUpperCase()}
                    </div>
                    <div className="match-info">
                      <p className="team-vs">{match.team1} vs {match.team2}</p>
                      <p className="match-date">{new Date(match.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LIVE SCORE DISPLAY */}
          <div className="live-score-display">
            {selectedMatch ? (
              <>
                <h2>Live Score</h2>
                <div className="score-card">
                  <div className="team-score">
                    <h3>{selectedMatch.team1}</h3>
                    <div className="score-box">
                      <p className="score-number">{selectedMatch.team1Score || 0}</p>
                      <p className="score-info">/{selectedMatch.team1Wickets || 0} wickets</p>
                      <p className="score-info">{selectedMatch.team1Overs || 0} overs</p>
                    </div>
                  </div>

                  <div className="vs-divider">VS</div>

                  <div className="team-score">
                    <h3>{selectedMatch.team2}</h3>
                    <div className="score-box">
                      <p className="score-number">{selectedMatch.team2Score || 0}</p>
                      <p className="score-info">/{selectedMatch.team2Wickets || 0} wickets</p>
                      <p className="score-info">{selectedMatch.team2Overs || 0} overs</p>
                    </div>
                  </div>
                </div>

                <div className="match-details">
                  <div className="detail-item">
                    <label>Status</label>
                    <p>{selectedMatch.status?.toUpperCase()}</p>
                  </div>
                  <div className="detail-item">
                    <label>Venue</label>
                    <p>{selectedMatch.venue || 'TBD'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Match Type</label>
                    <p>{selectedMatch.matchType || 'T20'}</p>
                  </div>
                  {selectedMatch.status === 'completed' && (
                    <div className="detail-item winner">
                      <label>Winner</label>
                      <p className="winner-text">{selectedMatch.winner || 'TBD'}</p>
                    </div>
                  )}
                </div>

                {/* LIVE UPDATES */}
                {selectedMatch.status === 'live' && liveScore && (
                  <div className="live-update">
                    <h3>⚡ Latest Update</h3>
                    <div className="update-content">
                      <p><strong>Current Run:</strong> {liveScore.currentRun || 0}</p>
                      <p><strong>Last Over:</strong> {liveScore.lastOver || 'N/A'}</p>
                      <p><strong>Update Time:</strong> {new Date(liveScore.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}

                {/* PREDICTION */}
                {selectedMatch.status === 'upcoming' && selectedMatch.prediction && (
                  <div className="match-prediction">
                    <h3>🔮 Match Prediction</h3>
                    <div className="prediction-content">
                      <p><strong>Predicted Winner:</strong> {selectedMatch.prediction.winner}</p>
                      <div className="win-probability">
                        <p>{selectedMatch.team1}: {selectedMatch.prediction.team1Prob}%</p>
                        <div className="prob-bar">
                          <div
                            className="prob-fill"
                            style={{ width: `${selectedMatch.prediction.team1Prob}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="win-probability">
                        <p>{selectedMatch.team2}: {selectedMatch.prediction.team2Prob}%</p>
                        <div className="prob-bar">
                          <div
                            className="prob-fill"
                            style={{ width: `${selectedMatch.prediction.team2Prob}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-match-selected">
                <p>Select a match to view live score</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatches;