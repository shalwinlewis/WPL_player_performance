import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, token, logout, updateUser } = useContext(AuthContext);
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user) {
      setFavoriteTeam(user.favoriteTeam || '');
      setFavoritePlayers(user.favoritePlayers || []);
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/teams`);
      setTeams(response.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleTeamChange = async (team) => {
    setFavoriteTeam(team);
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/favorite-team`,
        { team },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      updateUser(response.data);
    } catch (err) {
      console.error('Error updating favorite team:', err);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            {user.isAdmin && <span className="admin-badge">Admin</span>}
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h2>⚽ Favorite Team</h2>
          <select value={favoriteTeam} onChange={(e) => handleTeamChange(e.target.value)}>
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          {favoriteTeam && (
            <p className="selected-team">✅ You support: <strong>{favoriteTeam}</strong></p>
          )}
        </div>

        <div className="profile-card">
          <h2>❤️ Favorite Players</h2>
          {favoritePlayers.length > 0 ? (
            <div className="favorites-list">
              <p>You have {favoritePlayers.length} favorite player(s)</p>
              <p className="info-text">Manage your favorites from the player details page!</p>
            </div>
          ) : (
            <p className="no-favorites">No favorite players yet. Add them from player pages!</p>
          )}
        </div>

        <div className="profile-card">
          <h2>📊 Account Stats</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <label>Account Type</label>
              <p>{user.isAdmin ? 'Administrator' : 'User'}</p>
            </div>
            <div className="stat-box">
              <label>Member Since</label>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="stat-box">
              <label>Favorite Team</label>
              <p>{favoriteTeam || 'Not set'}</p>
            </div>
            <div className="stat-box">
              <label>Favorites</label>
              <p>{favoritePlayers.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;