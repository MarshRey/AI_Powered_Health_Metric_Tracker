import React, { useState, useEffect } from 'react';
import { generateDaysOfYear, getSleepColor } from './utils';

function ViewSleepPage() {
  const [metrics, setMetrics] = useState([]);
  const [goalSleep, setGoalSleep] = useState(8);
  const [goalMode, setGoalMode] = useState("custom"); // "preset" or "custom"
  const isValidGoal = (goalSleep !== "" && goalSleep > 0);

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
      <h2>Sleep Progress for {year}</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Sleep Goals: </label>
        <select
          value={goalMode === "custom" ? "custom" : setGoalSleep}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setGoalMode("custom");
              setGoalSleep(""); // clear input when switching to custom
            } else {
              setGoalMode("preset");
              setGoalSleep(parseInt(e.target.value));
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
              value={goalSleep}
              onChange={(e) => setGoalSleep(parseInt(e.target.value))}
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
          const sleep = metric ? metric.sleep_hours : null;
          const color = sleep !== null ? getSleepColor(sleep, goalSleep) : 'gray';

          return (
            <div
              key={index}
              title={`${dateStr}${sleep !== null ? `: ${sleep.toFixed(1)} hrs` : ': No data'}`}
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

export default ViewSleepPage;
