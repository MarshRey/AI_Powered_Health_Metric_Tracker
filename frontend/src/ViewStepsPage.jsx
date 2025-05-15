import React, { useState, useEffect } from 'react';
import { generateDaysOfYear, getStepsColor  } from './utils'; // or paste inside

function ViewStepsPage() {
  const [metrics, setMetrics] = useState([]);
  const [goalSteps, setGoalSteps] = useState(10000);
  const [goalMode, setGoalMode] = useState("custom"); // "preset" or "custom"
  const isValidGoal = (goalSteps !== "" && goalSteps > 0);

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
      <h2>Steps Progress for {year}</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Goal Steps: </label>
        <select
          value={goalMode === "custom" ? "custom" : goalSteps}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setGoalMode("custom");
              setGoalSteps(""); // clear input when switching to custom
            } else {
              setGoalMode("preset");
              setGoalSteps(parseInt(e.target.value));
            }
          }}
        >
          <option value="5000">5000 steps</option>
          <option value="7500">7500 steps</option>
          <option value="10000">10000 steps</option>
          <option value="12500">12500 steps</option>
          <option value="custom">Custom</option>
        </select>

        {goalMode === "custom" && (
          <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '10px' }}>
            <input
              type="number"
              placeholder="Enter custom goal"
              value={goalSteps}
              onChange={(e) => setGoalSteps(parseInt(e.target.value))}
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
          const steps = metric ? metric.steps : null;
          const color = steps !== null ? getStepsColor(steps, goalSteps) : 'gray';

          return (
            <div
              key={index}
              title={`${dateStr}${steps !== null ? `: ${steps} steps` : ': No data'}`}
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

export default ViewStepsPage;
