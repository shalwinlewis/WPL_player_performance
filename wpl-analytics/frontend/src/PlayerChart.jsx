import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function PlayerChart({ player }) {
  if (!player || !player.seasonal_stats) {
    return <div className="chart-placeholder">No data available</div>;
  }

  // Convert seasonal stats to array for charts
  const chartData = Object.entries(player.seasonal_stats)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([season, stats]) => ({
      season: `Season ${season}`,
      avg: stats.avg,
      runs: stats.runs,
      sr: stats.sr,
      matches: stats.matches,
      wickets: stats.wickets || 0,
    }));

  return (
    <div className="charts-container">
      <h3>Performance Trends</h3>

      {/* Average & Strike Rate Chart */}
      <div className="chart-wrapper">
        <h4>Batting Average & Strike Rate Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#8884d8"
              name="Average"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="sr"
              stroke="#82ca9d"
              name="Strike Rate"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Runs & Matches Chart */}
      <div className="chart-wrapper">
        <h4>Runs Scored Over Seasons</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="runs" fill="#8884d8" name="Total Runs" />
            <Bar dataKey="matches" fill="#82ca9d" name="Matches" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-item">
          <span>Career Average</span>
          <strong>
            {(
              chartData.reduce((sum, d) => sum + d.avg, 0) / chartData.length
            ).toFixed(2)}
          </strong>
        </div>
        <div className="summary-item">
          <span>Career Runs</span>
          <strong>{chartData.reduce((sum, d) => sum + d.runs, 0)}</strong>
        </div>
        <div className="summary-item">
          <span>Total Matches</span>
          <strong>{chartData.reduce((sum, d) => sum + d.matches, 0)}</strong>
        </div>
        <div className="summary-item">
          <span>Avg Strike Rate</span>
          <strong>
            {(
              chartData.reduce((sum, d) => sum + d.sr, 0) / chartData.length
            ).toFixed(1)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default PlayerChart;