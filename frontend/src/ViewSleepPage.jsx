import React, { useState, useEffect } from 'react';
import { generateDaysOfYear, getSleepColor } from './utils';

function ViewSleepPage() {
  const [metrics, setMetrics] = useState([]);
  const [goalSleep, setGoalSleep] = useState(8);
  const [goalMode, setGoalMode] = useState("preset");
  const [hoverInfo, setHoverInfo] = useState(null);

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
    <div style={{ padding: '20px', position: 'relative' }}>
      <h2>Sleep Progress for {year}</h2>

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
        <label>Goal Sleep (hrs): </label>
        <select
          value={goalMode === "custom" ? "custom" : goalSleep}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setGoalMode("custom");
              setGoalSleep("");
            } else {
              setGoalMode("preset");
              setGoalSleep(parseFloat(e.target.value));
            }
          }}
        >
          <option value="6">6 hours</option>
          <option value="7">7 hours</option>
          <option value="8">8 hours</option>
          <option value="9">9 hours</option>
          <option value="custom">Custom</option>
        </select>

        {goalMode === "custom" && (
          <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '10px' }}>
            <input
              type="number"
              placeholder="Enter custom goal"
              value={goalSleep}
              onChange={(e) => setGoalSleep(parseFloat(e.target.value))}
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
          const sleep = metric ? metric.sleep_hours : null;
          const color = sleep !== null ? getSleepColor(sleep, goalSleep) : 'gray';

          return (
            <div
              key={index}
              onMouseEnter={(e) => {
                const rect = e.target.getBoundingClientRect();
                setHoverInfo({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  text: sleep !== null ? `${sleep.toFixed(1)} hrs on ${dateStr}` : `No data on ${dateStr}`,
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
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

export default ViewSleepPage;
