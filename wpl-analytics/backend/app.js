const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const initializeSocket = require('./socket-setup');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const { io, socketMethods } = initializeSocket(server);
app.locals.io = io;
app.locals.socketMethods = socketMethods;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

const playersRoutes = require('./routes/players');
const authRoutes = require('./routes/auth');
const predictionsRoutes = require('./routes/predictions');
const rankingsRoutes = require('./routes/rankings');
const teamsRoutes = require('./routes/teams');
const adminRoutes = require('./routes/admin');
const Player = require('./models/Player');

app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    message: 'WPL Analytics API is running',
  });
});

app.use('/api/players', playersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/admin', adminRoutes);

// ── ML Routes ──────────────────────────────────────────────

// Get ML predictions for a player
app.get('/api/ml/predict/:playerId', async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Extract aggregated stats from seasonal_stats
    let totalRuns = 0;
    let totalMatches = 0;
    let totalWickets = 0;
    let avgAverage = 0;
    let avgStrikeRate = 0;

    if (player.seasonal_stats) {
      let seasonCount = 0;
      let sumAvg = 0;
      let sumSR = 0;

      for (const season in player.seasonal_stats) {
        const stats = player.seasonal_stats[season];
        totalRuns += stats.runs || 0;
        totalMatches += stats.matches || 0;
        totalWickets += stats.wickets || 0;

        if (stats.avg) {
          sumAvg += stats.avg;
          seasonCount++;
        }
        if (stats.sr) {
          sumSR += stats.sr;
        }
      }

      avgAverage = seasonCount > 0 ? sumAvg / seasonCount : 0;
      avgStrikeRate = seasonCount > 0 ? sumSR / seasonCount : 0;
    }

    const playerData = {
      totalRuns,
      matches: totalMatches,
      average: avgAverage,
      strikeRate: avgStrikeRate,
      wickets: totalWickets
    };

    const mlResponse = await axios.post('http://localhost:5001/predict/runs', {
      player: playerData
    });

    res.json({
      player: player.name,
      prediction: mlResponse.data.prediction
    });
  } catch (err) {
    console.error('ML API error:', err.message);
    res.status(500).json({ message: 'Error getting prediction' });
  }
});

// Batch predictions for all players
app.post('/api/ml/batch-predict', async (req, res) => {
  try {
    const players = await Player.find().limit(100);

    const playerData = players.map(p => {
      let totalRuns = 0;
      let totalMatches = 0;
      let totalWickets = 0;
      let avgAverage = 0;
      let avgStrikeRate = 0;

      if (p.seasonal_stats) {
        let seasonCount = 0;
        let sumAvg = 0;
        let sumSR = 0;

        for (const season in p.seasonal_stats) {
          const stats = p.seasonal_stats[season];
          totalRuns += stats.runs || 0;
          totalMatches += stats.matches || 0;
          totalWickets += stats.wickets || 0;

          if (stats.avg) {
            sumAvg += stats.avg;
            seasonCount++;
          }
          if (stats.sr) {
            sumSR += stats.sr;
          }
        }

        avgAverage = seasonCount > 0 ? sumAvg / seasonCount : 0;
        avgStrikeRate = seasonCount > 0 ? sumSR / seasonCount : 0;
      }

      return {
        _id: p._id,
        name: p.name,
        totalRuns,
        matches: totalMatches,
        average: avgAverage,
        strikeRate: avgStrikeRate,
        wickets: totalWickets
      };
    });

    const mlResponse = await axios.post('http://localhost:5001/batch-predict', {
      players: playerData
    });

    res.json(mlResponse.data);
  } catch (err) {
    console.error('Batch prediction error:', err.message);
    res.status(500).json({ message: 'Batch prediction failed' });
  }
});

// Train model with fresh data
app.post('/api/ml/train', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/train');
    res.json(response.data);
  } catch (err) {
    console.error('Training error:', err.message);
    res.status(500).json({ message: 'Training failed', error: err.message });
  }
});

// ── Error Handlers ─────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket enabled`);
});