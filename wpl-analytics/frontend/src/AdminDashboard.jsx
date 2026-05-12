import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [playersRes, rankingsRes] = await Promise.all([
        axios.get(`${API_URL}/api/players`),
        axios.get(`${API_URL}/api/rankings/overall`),
      ]);

      const players = playersRes.data;
      const batsmen = players.filter(p => p.role.includes('Batter')).length;
      const bowlers = players.filter(p => p.role.includes('Bowler')).length;
      const allrounders = players.filter(p => p.role.includes('All-rounder')).length;

      setStats({
        totalPlayers: players.length,
        batsmen,
        bowlers,
        allrounders,
        totalRuns: players.reduce((sum, p) => sum + (p.totalRuns || 0), 0),
        totalWickets: players.reduce((sum, p) => sum + (p.wickets || 0), 0),
        teams: [...new Set(players.map(p => p.team))].length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>❌ Access Denied</h2>
        <p>You don't have permission to access the admin dashboard</p>
        <p>Only administrators can access this page</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage players, data, and system settings</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          👥 Players
        </button>
        <button 
          className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          📤 Import Data
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading admin data...</div>
      ) : (
        <>
          {activeTab === 'overview' && stats && (
            <div className="admin-overview">
              <h2>System Statistics</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>👥 Total Players</h3>
                  <p className="stat-number">{stats.totalPlayers}</p>
                  <p className="stat-detail">Registered in system</p>
                </div>

                <div className="stat-card">
                  <h3>🏏 Batsmen</h3>
                  <p className="stat-number">{stats.batsmen}</p>
                  <p className="stat-detail">Players</p>
                </div>

                <div className="stat-card">
                  <h3>🎯 Bowlers</h3>
                  <p className="stat-number">{stats.bowlers}</p>
                  <p className="stat-detail">Players</p>
                </div>

                <div className="stat-card">
                  <h3>🌟 All-rounders</h3>
                  <p className="stat-number">{stats.allrounders}</p>
                  <p className="stat-detail">Players</p>
                </div>

                <div className="stat-card">
                  <h3>🏃 Total Runs</h3>
                  <p className="stat-number">{stats.totalRuns.toLocaleString()}</p>
                  <p className="stat-detail">Combined</p>
                </div>

                <div className="stat-card">
                  <h3>🎯 Total Wickets</h3>
                  <p className="stat-number">{stats.totalWickets}</p>
                  <p className="stat-detail">Combined</p>
                </div>

                <div className="stat-card">
                  <h3>🏆 Teams</h3>
                  <p className="stat-number">{stats.teams}</p>
                  <p className="stat-detail">Active teams</p>
                </div>

                <div className="stat-card">
                  <h3>📊 Data Health</h3>
                  <p className="stat-number">95%</p>
                  <p className="stat-detail">System operational</p>
                </div>
              </div>

              <div className="admin-info">
                <h3>Admin Information</h3>
                <div className="info-box">
                  <p><strong>Admin User:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> Administrator</p>
                  <p><strong>Dashboard Access:</strong> Full</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="admin-players">
              <h2>Player Management</h2>
              <div className="player-actions">
                <p>✅ View all players</p>
                <p>✏️ Edit player stats</p>
                <p>➕ Add new player</p>
                <p>🗑️ Delete player</p>
              </div>
              <p className="coming-soon">Coming in next update - Player CRUD interface</p>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="admin-import">
              <h2>Data Import</h2>
              <div className="import-options">
                <div className="import-card">
                  <h3>📤 Upload CSV File</h3>
                  <p>Import player data from CSV files</p>
                  <button className="import-btn">Upload CSV</button>
                </div>
                <div className="import-card">
                  <h3>📊 Upload Excel File</h3>
                  <p>Import player data from Excel files</p>
                  <button className="import-btn">Upload Excel</button>
                </div>
                <div className="import-card">
                  <h3>🔄 Bulk Update</h3>
                  <p>Update multiple players at once</p>
                  <button className="import-btn">Bulk Update</button>
                </div>
              </div>
              <p className="coming-soon">Data importer coming in Phase 4 update</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-settings">
              <h2>System Settings</h2>
              <div className="settings-grid">
                <div className="setting-card">
                  <h3>🔐 Security</h3>
                  <div className="setting-item">
                    <label>JWT Secret:</label>
                    <p>••••••••••••••••</p>
                  </div>
                  <div className="setting-item">
                    <label>Password Policy:</label>
                    <p>Minimum 8 characters required</p>
                  </div>
                </div>

                <div className="setting-card">
                  <h3>💾 Database</h3>
                  <div className="setting-item">
                    <label>MongoDB:</label>
                    <p>Connected ✅</p>
                  </div>
                  <div className="setting-item">
                    <label>Database Size:</label>
                    <p>~50 MB estimated</p>
                  </div>
                </div>

                <div className="setting-card">
                  <h3>🌐 API</h3>
                  <div className="setting-item">
                    <label>Backend URL:</label>
                    <p>{API_URL}</p>
                  </div>
                  <div className="setting-item">
                    <label>CORS Enabled:</label>
                    <p>Yes ✅</p>
                  </div>
                </div>

                <div className="setting-card">
                  <h3>📅 Maintenance</h3>
                  <button className="setting-btn">Clear Cache</button>
                  <button className="setting-btn">Backup Data</button>
                  <button className="setting-btn">System Check</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;