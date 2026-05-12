import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import LoginSignup from './LoginSignup';
import Dashboard from './Dashboard';
import RankingsPage from './RankingsPage';
import PredictionsPage from './PredictionsPage';
import TeamComparison from './TeamComparison';
import UserProfile from './UserProfile';
import HistoricalCharts from './HistoricalCharts';
import PlayerComparison from './PlayerComparison';
import MatchPredictions from './MatchPredictions';
import PerformanceAnalytics from './PerformanceAnalytics';
import './App.css';
import AdminDashboard from './AdminDashboard';
import DataImporter from './DataImporter';
import LiveMatches from './LiveMatches';
import Notifications from './Notifications';

function AppContent() {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return <LoginSignup onSuccess={() => window.location.href = '/'} />;
  }

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-brand">🏏 WPL Analytics</div>
        <ul className="nav-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/rankings">Rankings</a></li>
          <li><a href="/predictions">Predictions</a></li>
          <li><a href="/teams">Teams</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/live">🔴 Live Matches</a></li>
          <li><a href="/notifications">🔔 Notifications</a></li>
          <li className="dropdown">
            <a href="#">Advanced Features ▼</a>
            <div className="dropdown-menu">
              <a href="/historical">Historical Trends</a>
              <a href="/player-comparison">Player Comparison</a>
              <a href="/match-predictions">Match Predictions</a>
              <a href="/analytics">Performance Analytics</a>
            </div>
          </li>
          {user?.isAdmin && (
            <li className="dropdown">
              <a href="#">Admin ▼</a>
              <div className="dropdown-menu">
                <a href="/admin">Dashboard</a>
                <a href="/admin/import">Import Data</a>
              </div>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rankings" element={<RankingsPage />} />
        <Route path="/predictions" element={<PredictionsPage />} />
        <Route path="/teams" element={<TeamComparison />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/historical" element={<HistoricalCharts />} />
        <Route path="/player-comparison" element={<PlayerComparison />} />
        <Route path="/match-predictions" element={<MatchPredictions />} />
        <Route path="/analytics" element={<PerformanceAnalytics />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/import" element={<DataImporter />} />
        <Route path="/live" element={<LiveMatches />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;