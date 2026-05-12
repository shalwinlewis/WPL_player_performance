import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import LoginSignup from './LoginSignup';
import Dashboard from './Dashboard';
import RankingsPage from './RankingsPage';
import PredictionsPage from './PredictionsPage';
import TeamComparison from './TeamComparison';
import UserProfile from './UserProfile';
import './App.css';

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return element;
};

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
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rankings" element={<RankingsPage />} />
        <Route path="/predictions" element={<PredictionsPage />} />
        <Route path="/teams" element={<TeamComparison />} />
        <Route path="/profile" element={<UserProfile />} />
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