import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './TeamStats.css';

function TeamStats({ players }) {
  if (!players || players.length === 0) {
    return <div className="team-stats-placeholder">Loading...</div>;
  }

  // Get unique teams
  const teams = [...new Set(players.map((p) => p.team))];

  // Calculate team statistics
  const teamStats = teams.map((team) => {
    const teamPlayers = players.filter((p) => p.team === team);
    const totalRuns = teamPlayers.reduce((sum, p) => {
      return (
        sum +
        Object.values(p.seasonal_stats || {}).reduce((s, stat) => s + stat.runs, 0)
      );
    }, 0);
    const totalMatches = teamPlayers.reduce((sum, p) => {
      return (
        sum +
        Object.values(p.seasonal_stats || {}).reduce((s, stat) => s + stat.matches, 0)
      );
    }, 0);
    const avgRunsPerPlayer =
      teamPlayers.length > 0
        ? Object.values(teamPlayers[0].seasonal_stats || {}).reduce(
            (sum, stat) => sum + stat.avg,
            0
          ) / Object.keys(teamPlayers[0].seasonal_stats || {}).length
        : 0;

    return {
      team,
      players: teamPlayers.length,
      runs: totalRuns,
      matches: totalMatches,
      avgRunsPerPlayer: (totalRuns / totalMatches).toFixed(2),
    };
  });

  // Top teams by runs
  const topTeams = [...teamStats].sort((a, b) => b.runs - a.runs).slice(0, 5);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="team-stats-container">
      <h2>Team Statistics</h2>

      {/* Teams Overview */}
      <div className="team-overview">
        <h3>Teams Overview</h3>
        <div className="teams-grid">
          {teamStats.map((team) => (
            <div key={team.team} className="team-card">
              <div className="team-name">{team.team}</div>
              <div className="team-stat">
                <span>Players</span>
                <strong>{team.players}</strong>
              </div>
              <div className="team-stat">
                <span>Total Runs</span>
                <strong>{team.runs}</strong>
              </div>
              <div className="team-stat">
                <span>Matches</span>
                <strong>{team.matches}</strong>
              </div>
              <div className="team-stat">
                <span>Avg per Match</span>
                <strong>{team.avgRunsPerPlayer}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Teams Chart */}
      <div className="chart-wrapper">
        <h3>Top Teams by Total Runs</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topTeams}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="runs" fill="#8884d8" name="Total Runs" />
            <Bar dataKey="matches" fill="#82ca9d" name="Matches Played" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Team Distribution */}
      <div className="chart-wrapper">
        <h3>Players per Team</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={teamStats}
              dataKey="players"
              nameKey="team"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {teamStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TeamStats;