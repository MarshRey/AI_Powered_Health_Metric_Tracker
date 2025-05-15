import React, { useState, useEffect } from 'react';
import { generateDaysOfYear, getHeartRateColor } from './utils';

function ViewHeartRatePage() {
  const [metrics, setMetrics] = useState([]);
  const [goalHR, setGoalHR] = useState(65);
  const [goalMode, setGoalMode] = useState("custom"); // "preset" or "custom"
  const isValidGoal = (goalHR !== "" && goalHR > 0);

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('http://localhost:8000/metrics');
      const data = await response.json();
      setMetrics(data);
    };
    fetchMetrics();
  }, []);

  const metricsByDate = {};
  metrics.forEach(m => {
    metricsByDate[m.date] = m;
  });

  const year = new Date().getFullYear();
  const daysOfYear = generateDaysOfYear(year);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Heart Rate Progress for {year}</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Sleep Goals: </label>
        <select
          value={goalMode === "custom" ? "custom" : setGoalHR}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setGoalMode("custom");
              setGoalHR(""); // clear input when switching to custom
            } else {
              setGoalMode("preset");
              setGoalHR(parseInt(e.target.value));
            }
          }}
        >
          <option value="4">4 hours</option>
          <option value="6">6 hours</option>
          <option value="8">8 hours</option>
          <option value="10">10 hours</option>
          <option value="12">12 hours</option>
          <option value="custom">Custom</option>
        </select>

        {goalMode === "custom" && (
          <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '10px' }}>
            <input
              type="number"
              placeholder="Enter custom goal"
              value={goalHR}
              onChange={(e) => setGoalHR(parseInt(e.target.value))}
              style={{ marginRight: '8px' }}
            />
            {isValidGoal && (
              <span style={{ color: 'green', fontSize: '16px' }}>✔️</span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1200px' }}>
        {daysOfYear.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const metric = metricsByDate[dateStr];
          const hr = metric ? metric.heart_rate : null;
          const color = hr !== null ? getHeartRateColor(hr, goalHR) : 'gray';
          
          return (
            <div
              key={index}
              title={`${dateStr}${hr !== null ? `: ${hr} bpm` : ': No data'}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: color,
                margin: '2px',
                borderRadius: '3px',
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default ViewHeartRatePage;
