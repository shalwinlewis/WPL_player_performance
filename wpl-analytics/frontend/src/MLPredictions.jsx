import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MLPredictions.css';

const MLPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching from:', `${API_URL}/api/ml/batch-predict`);
      
      const response = await axios.post(`${API_URL}/api/ml/batch-predict`);
      console.log('✅ Got response:', response.data);
      
      if (response.data && response.data.results) {
        setPredictions(response.data.results);
        console.log('✅ Set predictions:', response.data.results.length, 'items');
      }
    } catch (err) {
      console.error('❌ Error:', err.message);
      setError('Error fetching predictions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const trainModel = async () => {
    try {
      setTraining(true);
      setError('');
      console.log('🤖 Training model...');
      
      const response = await axios.post(`${API_URL}/api/ml/train`);
      console.log('✅ Training response:', response.data);
      
      const metrics = response.data.metrics;
      alert(`✅ Model Trained!\n\nR² Score: ${metrics.r2_score.toFixed(4)}\nRMSE: ${metrics.rmse.toFixed(2)}`);
      
      setTimeout(() => {
        fetchPredictions();
      }, 1000);
    } catch (err) {
      console.error('❌ Training error:', err);
      setError('Training failed: ' + err.message);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="ml-predictions">
      <div className="ml-header">
        <div>
          <h1>🤖 ML Player Predictions</h1>
          <p>AI-powered performance forecasts</p>
        </div>
        {predictions.length > 0 && (
          <div className="count-badge">{predictions.length} Players</div>
        )}
      </div>

      {error && (
        <div className="error-box">
          <p>❌ {error}</p>
        </div>
      )}

      <div className="controls">
        <button 
          onClick={fetchPredictions} 
          disabled={loading}
          className="btn-refresh"
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
        <button 
          onClick={trainModel} 
          disabled={training}
          className="btn-train"
        >
          {training ? '⏳ Training...' : '🎓 Train Model'}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>⏳ Loading predictions...</p>
        </div>
      ) : predictions.length === 0 ? (
        <div className="empty-state">
          <p>📭 No predictions yet</p>
          <p>Click "🎓 Train Model" to generate predictions</p>
        </div>
      ) : (
        <div className="predictions-grid">
          {predictions.map((pred, idx) => (
            <div key={pred.playerId || idx} className="prediction-card">
              <div className="card-header">
                <h3>{pred.name}</h3>
                {pred.form && (
                  <span className={`form-badge form-${pred.form.form.toLowerCase()}`}>
                    {pred.form.form}
                  </span>
                )}
              </div>

              <div className="card-content">
                {pred.prediction && (
                  <div className="metric">
                    <label>Predicted Runs</label>
                    <p className="value">{Math.round(pred.prediction.predicted_runs)}</p>
                  </div>
                )}

                {pred.prediction && (
                  <div className="metric">
                    <label>Confidence</label>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${pred.prediction.confidence || 0}%` }}
                      ></div>
                    </div>
                    <p className="value">{(pred.prediction.confidence || 0).toFixed(1)}%</p>
                  </div>
                )}

                {pred.form && (
                  <div className="metric">
                    <label>Form Score</label>
                    <p className="value">{pred.form.form_score.toFixed(1)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MLPredictions;