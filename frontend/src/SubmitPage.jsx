import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SubmitPage() {
  const [steps, setSteps] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = selectedDate.toISOString().split('T')[0];

    await fetch('http://localhost:8000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        steps: parseInt(steps),
        sleep_hours: parseFloat(sleepHours),
        heart_rate: parseInt(heartRate),
        date: formattedDate,
      }),
    });

    setSteps('');
    setSleepHours('');
    setHeartRate('');
    alert('Data Submitted!');
  };

  const randomizeYear = async () => {
    const year = new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    let current = start;
    while (current <= end) {
      const chance = Math.random();
      if (chance < 0.95) {
        // 95% chance to insert random data
        const formattedDate = current.toISOString().split('T')[0];
        await fetch('http://localhost:8000/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            steps: Math.floor(Math.random() * 15000),          // 0–15000 steps
            sleep_hours: (Math.random() * 4) + 4,              // 4–8 hours sleep
            heart_rate: Math.floor(Math.random() * 30) + 50,   // 50–80 bpm
            date: formattedDate,
          }),
        });
      }
      // 5% chance: do nothing = no entry = gray square
      current.setDate(current.getDate() + 1);
    }
    alert('Randomized data for the year!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Health Data</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <input type="number" placeholder="Steps" value={steps} onChange={(e) => setSteps(e.target.value)} required />
        <input type="number" placeholder="Sleep Hours" step="0.1" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} required />
        <input type="number" placeholder="Heart Rate" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button onClick={randomizeYear}>Randomize Entire Year</button>
      </div>
    </div>
  );
}

export default SubmitPage;
