import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SubmitPage from './SubmitPage.jsx';
import ViewStepsPage from './ViewStepsPage.jsx';
import ViewSleepPage from './ViewSleepPage.jsx';
import ViewHeartRatePage from './ViewHeartRatePage.jsx';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Submit Today's Data</Link>
          <Link to="/view-steps" style={{ marginRight: '10px' }}>View Steps</Link>
          <Link to="/view-sleep" style={{ marginRight: '10px' }}>View Sleep</Link>
          <Link to="/view-heartrate">View Heart Rate</Link>
        </nav>

        <Routes>
          <Route path="/" element={<SubmitPage />} />
          <Route path="/view-steps" element={<ViewStepsPage />} />
          <Route path="/view-sleep" element={<ViewSleepPage />} />
          <Route path="/view-heartrate" element={<ViewHeartRatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
