import React, { useState, useEffect } from 'react';
import { generateDaysOfYear, getHeartRateColor } from './utils';

function ViewHeartRatePage() {
  const [metrics, setMetrics] = useState([]);
  const [goalHR, setGoalHR] = useState(65);
  const [goalMode, setGoalMode] = useState("preset");
  const [hoverInfo, setHoverInfo] = useState(null);

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
    <div style={{ padding: '20px', position: 'relative' }}>
      <h2>Heart Rate Progress for {year}</h2>

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
        <label>Goal HR (bpm): </label>
        <select
          value={goalMode === "custom" ? "custom" : goalHR}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setGoalMode("custom");
              setGoalHR("");
            } else {
              setGoalMode("preset");
              setGoalHR(parseInt(e.target.value));
            }
          }}
        >
          <option value="55">55 bpm</option>
          <option value="60">60 bpm</option>
          <option value="65">65 bpm</option>
          <option value="70">70 bpm</option>
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

      {/* Squares */}
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1200px' }}>
        {daysOfYear.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const metric = metricsByDate[dateStr];
          const hr = metric ? metric.heart_rate : null;
          const color = hr !== null ? getHeartRateColor(hr, goalHR) : 'gray';

          return (
            <div
              key={index}
              onMouseEnter={(e) => {
                const rect = e.target.getBoundingClientRect();
                setHoverInfo({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  text: hr !== null ? `${hr} bpm on ${dateStr}` : `No data on ${dateStr}`,
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

export default ViewHeartRatePage;
