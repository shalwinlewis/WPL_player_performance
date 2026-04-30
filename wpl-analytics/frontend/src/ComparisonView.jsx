import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import './ComparisonView.css';

function ComparisonView({ allPlayers, selectedPlayer }) {
  const [compareWith, setCompareWith] = useState(null);

  if (!selectedPlayer) {
    return (
      <div className="comparison-placeholder">
        <p>Select a player first to compare</p>
      </div>
    );
  }

  const comparisonPlayers = compareWith
    ? [selectedPlayer, compareWith]
    : [selectedPlayer];

  // Prepare comparison data for bar chart
  const comparisonData = [
    {
      metric: 'Avg (Latest)',
      [selectedPlayer.name]:
        selectedPlayer.seasonal_stats[
          Math.max(...Object.keys(selectedPlayer.seasonal_stats))
        ]?.avg || 0,
      ...(compareWith && {
        [compareWith.name]:
          compareWith.seasonal_stats[
            Math.max(...Object.keys(compareWith.seasonal_stats))
          ]?.avg || 0,
      }),
    },
    {
      metric: 'Strike Rate',
      [selectedPlayer.name]:
        selectedPlayer.seasonal_stats[
          Math.max(...Object.keys(selectedPlayer.seasonal_stats))
        ]?.sr || 0,
      ...(compareWith && {
        [compareWith.name]:
          compareWith.seasonal_stats[
            Math.max(...Object.keys(compareWith.seasonal_stats))
          ]?.sr || 0,
      }),
    },
    {
      metric: 'Career Avg',
      [selectedPlayer.name]:
        Object.values(selectedPlayer.seasonal_stats).reduce((sum, s) => sum + s.avg, 0) /
        Object.values(selectedPlayer.seasonal_stats).length,
      ...(compareWith && {
        [compareWith.name]:
          Object.values(compareWith.seasonal_stats).reduce((sum, s) => sum + s.avg, 0) /
          Object.values(compareWith.seasonal_stats).length,
      }),
    },
    {
      metric: 'Total Runs',
      [selectedPlayer.name]: Object.values(selectedPlayer.seasonal_stats).reduce(
        (sum, s) => sum + s.runs,
        0
      ),
      ...(compareWith && {
        [compareWith.name]: Object.values(compareWith.seasonal_stats).reduce(
          (sum, s) => sum + s.runs,
          0
        ),
      }),
    },
  ];

  return (
    <div className="comparison-container">
      <h3>Player Comparison</h3>

      <div className="comparison-selector">
        <p>Compare {selectedPlayer.name} with:</p>
        <select
          value={compareWith?.player_id || ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const player = allPlayers.find((p) => p.player_id === selectedId);
            setCompareWith(player || null);
          }}
          className="comparison-select"
        >
          <option value="">Select a player...</option>
          {allPlayers
            .filter((p) => p.player_id !== selectedPlayer.player_id)
            .map((player) => (
              <option key={player.player_id} value={player.player_id}>
                {player.name} ({player.team})
              </option>
            ))}
        </select>
      </div>

      {compareWith && (
        <>
          {/* Comparison Chart */}
          <div className="chart-wrapper">
            <h4>Statistics Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={selectedPlayer.name} fill="#8884d8" />
                <Bar dataKey={compareWith.name} fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Head to Head Stats */}
          <div className="h2h-stats">
            <h4>Head to Head</h4>
            <div className="h2h-grid">
              {[
                {
                  label: 'Latest Average',
                  key: 'avg',
                },
                {
                  label: 'Latest Strike Rate',
                  key: 'sr',
                },
                {
                  label: 'Total Runs',
                  key: 'runs',
                },
                {
                  label: 'Total Matches',
                  key: 'matches',
                },
              ].map((stat) => {
                const player1Value =
                  selectedPlayer.seasonal_stats[
                    Math.max(...Object.keys(selectedPlayer.seasonal_stats))
                  ]?.[stat.key] ||
                  Object.values(selectedPlayer.seasonal_stats).reduce(
                    (sum, s) => sum + (s[stat.key] || 0),
                    0
                  );

                const player2Value =
                  compareWith.seasonal_stats[
                    Math.max(...Object.keys(compareWith.seasonal_stats))
                  ]?.[stat.key] ||
                  Object.values(compareWith.seasonal_stats).reduce(
                    (sum, s) => sum + (s[stat.key] || 0),
                    0
                  );

                const isPlayer1Better = player1Value > player2Value;

                return (
                  <div key={stat.label} className="h2h-item">
                    <div className="h2h-stat">
                      <span className="stat-label">{stat.label}</span>
                      <div className="stat-values">
                        <div
                          className={`stat-value ${
                            isPlayer1Better ? 'winner' : ''
                          }`}
                        >
                          {typeof player1Value === 'number'
                            ? player1Value.toFixed(2)
                            : player1Value}
                        </div>
                        <div className="vs">vs</div>
                        <div
                          className={`stat-value ${
                            !isPlayer1Better ? 'winner' : ''
                          }`}
                        >
                          {typeof player2Value === 'number'
                            ? player2Value.toFixed(2)
                            : player2Value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ComparisonView;