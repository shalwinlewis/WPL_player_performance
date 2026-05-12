import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = {};
  }

  connect(url) {
    const API_URL = url || process.env.REACT_APP_API_URL || 'http://localhost:5000';

    if (this.socket) {
      return this.socket;
    }

    this.socket = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.isConnected = true;
      this.emit('connected', { timestamp: new Date() });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      this.isConnected = false;
      this.emit('disconnected', { timestamp: new Date() });
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('🔄 Attempting to reconnect...');
      this.emit('reconnecting', { timestamp: new Date() });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  on(event, callback) {
    if (!this.socket) {
      console.warn('WebSocket not connected');
      return;
    }

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    this.socket.off(event, callback);
  }

  emit(event, data) {
    if (!this.socket) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit(event, data);
  }

  // Real-time event methods
  onLiveScore(callback) {
    this.on('live:score', callback);
  }

  onPlayerUpdate(callback) {
    this.on('live:player-update', callback);
  }

  onNotification(callback) {
    this.on('notification', callback);
  }

  onPredictionUpdate(callback) {
    this.on('live:prediction', callback);
  }

  onLeaderboardUpdate(callback) {
    this.on('live:leaderboard', callback);
  }

  // Emit events to server
  subscribeToMatch(matchId) {
    this.emit('subscribe:match', { matchId });
  }

  unsubscribeFromMatch(matchId) {
    this.emit('unsubscribe:match', { matchId });
  }

  subscribeToLeaderboard() {
    this.emit('subscribe:leaderboard');
  }

  unsubscribeFromLeaderboard() {
    this.emit('unsubscribe:leaderboard');
  }

  subscribeToNotifications() {
    this.emit('subscribe:notifications');
  }

  updateUserStatus(status) {
    this.emit('user:status', status);
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      timestamp: new Date(),
    };
  }
}

export default new WebSocketService();