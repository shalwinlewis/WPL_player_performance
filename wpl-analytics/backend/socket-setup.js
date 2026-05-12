const socketIO = require('socket.io');

// Initialize Socket.IO with CORS settings
const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://wpl-player-performance.vercel.app',
      ],
      methods: ['GET', 'POST'],
    },
  });

  // Store active connections
  const activeConnections = new Map();
  const matchSubscriptions = new Map();
  const notificationSubscribers = new Set();

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    activeConnections.set(socket.id, {
      connectedAt: new Date(),
      subscriptions: new Set(),
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to WPL Analytics',
      timestamp: new Date(),
    });

    // Subscribe to match updates
    socket.on('subscribe:match', (data) => {
      const { matchId } = data;
      socket.join(`match:${matchId}`);

      if (!matchSubscriptions.has(matchId)) {
        matchSubscriptions.set(matchId, new Set());
      }
      matchSubscriptions.get(matchId).add(socket.id);

      const connection = activeConnections.get(socket.id);
      if (connection) {
        connection.subscriptions.add(matchId);
      }

      console.log(`📊 User ${socket.id} subscribed to match: ${matchId}`);
      socket.emit('subscribed', { matchId });
    });

    // Unsubscribe from match
    socket.on('unsubscribe:match', (data) => {
      const { matchId } = data;
      socket.leave(`match:${matchId}`);

      if (matchSubscriptions.has(matchId)) {
        matchSubscriptions.get(matchId).delete(socket.id);
      }

      const connection = activeConnections.get(socket.id);
      if (connection) {
        connection.subscriptions.delete(matchId);
      }

      console.log(`📊 User ${socket.id} unsubscribed from match: ${matchId}`);
    });

    // Subscribe to leaderboard updates
    socket.on('subscribe:leaderboard', () => {
      socket.join('leaderboard');
      const connection = activeConnections.get(socket.id);
      if (connection) {
        connection.subscriptions.add('leaderboard');
      }
      console.log(`📈 User ${socket.id} subscribed to leaderboard`);
    });

    // Unsubscribe from leaderboard
    socket.on('unsubscribe:leaderboard', () => {
      socket.leave('leaderboard');
      const connection = activeConnections.get(socket.id);
      if (connection) {
        connection.subscriptions.delete('leaderboard');
      }
    });

    // Subscribe to notifications
    socket.on('subscribe:notifications', () => {
      notificationSubscribers.add(socket.id);
      const connection = activeConnections.get(socket.id);
      if (connection) {
        connection.subscriptions.add('notifications');
      }
      console.log(`🔔 User ${socket.id} subscribed to notifications`);
    });

    // User status update
    socket.on('user:status', (data) => {
      const connection = activeConnections.get(socket.id);
      if (connection) {
        connection.status = data;
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      activeConnections.delete(socket.id);
      notificationSubscribers.delete(socket.id);

      // Clean up match subscriptions
      matchSubscriptions.forEach((subscribers) => {
        subscribers.delete(socket.id);
      });
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  // Socket.IO methods for backend to emit events
  const socketMethods = {
    // Emit live score update
    emitLiveScore: (matchId, scoreData) => {
      io.to(`match:${matchId}`).emit('live:score', {
        matchId,
        ...scoreData,
        timestamp: new Date(),
      });
      console.log(`🏏 Live score update for match ${matchId}`);
    },

    // Emit player update
    emitPlayerUpdate: (playerId, playerData) => {
      io.emit('live:player-update', {
        playerId,
        ...playerData,
        timestamp: new Date(),
      });
      console.log(`👤 Player update for ${playerId}`);
    },

    // Emit leaderboard update
    emitLeaderboardUpdate: (leaderboardData) => {
      io.to('leaderboard').emit('live:leaderboard', {
        ...leaderboardData,
        timestamp: new Date(),
      });
      console.log(`📈 Leaderboard updated`);
    },

    // Emit prediction update
    emitPredictionUpdate: (matchId, predictionData) => {
      io.to(`match:${matchId}`).emit('live:prediction', {
        matchId,
        ...predictionData,
        timestamp: new Date(),
      });
      console.log(`🔮 Prediction update for match ${matchId}`);
    },

    // Send notification
    sendNotification: (notification) => {
      io.to(Array.from(notificationSubscribers)).emit('notification', {
        ...notification,
        timestamp: new Date(),
      });
      console.log(`🔔 Notification sent: ${notification.message}`);
    },

    // Broadcast to specific match room
    broadcastToMatch: (matchId, event, data) => {
      io.to(`match:${matchId}`).emit(event, {
        ...data,
        timestamp: new Date(),
      });
    },

    // Get active connections count
    getActiveConnections: () => {
      return activeConnections.size;
    },

    // Get connections for a match
    getMatchSubscribers: (matchId) => {
      return matchSubscriptions.get(matchId)?.size || 0;
    },

    // Get all active subscriptions
    getActiveSubsriptions: () => {
      const subs = {
        total: activeConnections.size,
        notifications: notificationSubscribers.size,
        matches: matchSubscriptions.size,
        details: Array.from(activeConnections).map(([id, conn]) => ({
          socketId: id,
          subscriptions: Array.from(conn.subscriptions),
          connectedAt: conn.connectedAt,
        })),
      };
      return subs;
    },
  };

  return { io, socketMethods };
};

module.exports = initializeSocket;