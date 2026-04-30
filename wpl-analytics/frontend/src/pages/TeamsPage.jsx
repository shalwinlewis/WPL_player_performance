import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamStats from '../TeamStats';

const API_URL = 'http://localhost:5000';

function TeamsPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return <TeamStats players={players} />;
}

export default TeamsPage;