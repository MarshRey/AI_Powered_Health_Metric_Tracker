import React, { useState, useEffect } from 'react';
import { generateDaysOfYear, getStepsColor } from './utils';

function ViewStepsPage() {
  const [metrics, setMetrics] = useState([]);
  const [goalSteps, setGoalSteps] = useState(10000);
  const [goalMode, setGoalMode] = useState("preset");
  const [hoverInfo, setHoverInfo] = useState(null);

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
    <div style={{ padding: '20px', position: 'relative' }}>
      <h2>Steps Progress for {year}</h2>

      {/* Legend */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          height: '20px',
          width: '300px',
          background: 'linear-gradient(to right, red, yellow, green)',
          borderRadius: '10px',
          marginBottom: '5px'
        }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px', fontSize: '12px' }}>
          <span>Bad</span>
          <span>OK</span>
          <span>Good</span>
        </div>
      </div>

      {/* Goal Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label>Goal Steps: </label>
        <select
          value={goalMode === "custom" ? "custom" : goalSteps}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setGoalMode("custom");
              setGoalSteps("");
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

      {/* Squares */}
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1200px' }}>
        {daysOfYear.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const metric = metricsByDate[dateStr];
          const steps = metric ? metric.steps : null;
          const color = steps !== null ? getStepsColor(steps, goalSteps) : 'gray';

          return (
            <div
              key={index}
              onMouseEnter={(e) => {
                const rect = e.target.getBoundingClientRect();
                setHoverInfo({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  text: steps !== null ? `${steps} steps on ${dateStr}` : `No data on ${dateStr}`,
                });
              }}
              onMouseLeave={() => setHoverInfo(null)}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: color,
                margin: '2px',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease', // Smooth hover animation
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            ></div>
          );
        })}
      </div>

      {/* Floating Tooltip */}
      {hoverInfo && (
        <div style={{
          position: 'fixed',
          top: hoverInfo.y - 40,
          left: hoverInfo.x,
          backgroundColor: 'black',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          pointerEvents: 'none',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          whiteSpace: 'nowrap',
        }}>
          {hoverInfo.text}
        </div>
      )}
    </div>
  );
}

export default ViewStepsPage;
