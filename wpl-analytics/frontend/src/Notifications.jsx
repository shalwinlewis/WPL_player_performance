import React, { useState, useEffect } from 'react';
import WebSocketService from './WebSocketService';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    liveScores: true,
    playerUpdates: true,
    predictions: true,
    system: true,
  });

  useEffect(() => {
    connectToNotifications();
    loadSettings();

    return () => {
      // Cleanup
    };
  }, []);

  const connectToNotifications = () => {
    WebSocketService.onNotification((data) => {
      const notification = {
        id: Date.now(),
        ...data,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 50));

      // Show browser notification if enabled
      if (notificationSettings[data.type] && 'Notification' in window) {
        requestNotificationPermission();
        new Notification('WPL Analytics', {
          body: data.message,
          icon: getNotificationIcon(data.type),
          tag: data.type,
        });
      }
    });

    WebSocketService.subscribeToNotifications();
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setNotificationSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (settings) => {
    setNotificationSettings(settings);
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  };

  const handleSettingChange = (setting) => {
    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };
    saveSettings(newSettings);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'liveScores':
        return '🏏';
      case 'playerUpdates':
        return '👤';
      case 'predictions':
        return '🔮';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'liveScores':
        return '#FF6B6B';
      case 'playerUpdates':
        return '#4CAF50';
      case 'predictions':
        return '#2196F3';
      case 'system':
        return '#FF9800';
      default:
        return '#667eea';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>🔔 Notifications</h1>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} New</span>
        )}
      </div>

      <div className="notifications-content">
        {/* SETTINGS PANEL */}
        <div className="notification-settings">
          <h2>Notification Preferences</h2>
          
          <div className="settings-group">
            <label className="setting-option">
              <input
                type="checkbox"
                checked={notificationSettings.liveScores}
                onChange={() => handleSettingChange('liveScores')}
              />
              <span className="label-text">
                <span className="icon">🏏</span>
                Live Scores
              </span>
            </label>

            <label className="setting-option">
              <input
                type="checkbox"
                checked={notificationSettings.playerUpdates}
                onChange={() => handleSettingChange('playerUpdates')}
              />
              <span className="label-text">
                <span className="icon">👤</span>
                Player Updates
              </span>
            </label>

            <label className="setting-option">
              <input
                type="checkbox"
                checked={notificationSettings.predictions}
                onChange={() => handleSettingChange('predictions')}
              />
              <span className="label-text">
                <span className="icon">🔮</span>
                Predictions
              </span>
            </label>

            <label className="setting-option">
              <input
                type="checkbox"
                checked={notificationSettings.system}
                onChange={() => handleSettingChange('system')}
              />
              <span className="label-text">
                <span className="icon">⚙️</span>
                System Updates
              </span>
            </label>
          </div>

          <button 
            className="request-permission-btn"
            onClick={requestNotificationPermission}
          >
            Enable Browser Notifications
          </button>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="notifications-list">
          <div className="list-header">
            <h2>Recent Notifications</h2>
            <div className="list-actions">
              {unreadCount > 0 && (
                <button className="action-btn" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
              <button className="action-btn" onClick={clearAllNotifications}>
                Clear all
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <p>📭 No notifications yet</p>
              <small>You'll see live updates here when matches start</small>
            </div>
          ) : (
            <div className="notifications-scroll">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  style={{
                    borderLeftColor: getNotificationColor(notification.type),
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <p className="notification-title">{notification.title || 'Update'}</p>
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="mark-read-btn"
                        onClick={() => markAsRead(notification.id)}
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;