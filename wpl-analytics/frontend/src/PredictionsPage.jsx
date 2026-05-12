import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PredictionsPage.css';

const PredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/predictions/top/performers`);
      setPredictions(response.data);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFormColor = (form) => {
    switch (form) {
      case 'excellent':
        return '#4CAF50';
      case 'good':
        return '#2196F3';
      case 'average':
        return '#FF9800';
      case 'poor':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className="predictions-page">
      <div className="predictions-header">
        <h1>🤖 AI Predictions</h1>
        <p>Machine Learning predictions for next match performance</p>
      </div>

      {loading ? (
        <div className="loading">Loading predictions...</div>
      ) : predictions.length === 0 ? (
        <div className="no-data">No predictions available. Run /recalculate/all first!</div>
      ) : (
        <div className="predictions-grid">
          {predictions.map((pred, index) => (
            <div key={pred._id} className="prediction-card">
              <div className="card-header">
                <h3>{index + 1}. {pred.playerName}</h3>
                <span className="trend-badge">
                  {getTrendIcon(pred.trend)} {pred.trend}
                </span>
              </div>

              <div className="prediction-stats">
                <div className="stat-item">
                  <label>Form</label>
                  <div
                    className="form-badge"
                    style={{ backgroundColor: getFormColor(pred.form) }}
                  >
                    {pred.form.toUpperCase()}
                  </div>
                </div>

                <div className="stat-item">
                  <label>Form Score</label>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pred.formScore}%` }}
                    ></div>
                  </div>
                  <p className="stat-value">{pred.formScore}/100</p>
                </div>

                <div className="stat-item">
                  <label>Confidence</label>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pred.confidence}%` }}
                    ></div>
                  </div>
                  <p className="stat-value">{pred.confidence}%</p>
                </div>

                <div className="stat-item">
                  <label>Win Probability</label>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pred.winProbability}%` }}
                    ></div>
                  </div>
                  <p className="stat-value">{pred.winProbability}%</p>
                </div>

                <div className="stat-item">
                  <label>Predicted Score</label>
                  <p className="large-stat">{Math.round(pred.nextMatchScore)}</p>
                </div>

                <div className="stat-item">
                  <label>Consistency</label>
                  <p className="stat-value">{pred.consistency}%</p>
                </div>
              </div>

              <div className="card-footer">
                <p>Average: {pred.averageScore}</p>
                <p>Strike Rate: {pred.strikeRate}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionsPage;