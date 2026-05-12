const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
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