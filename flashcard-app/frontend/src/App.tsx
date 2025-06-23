import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PracticeView from './components/PracticeView';
import Dashboard from './components/Dashboard'; // You'll create this next

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav style={{ backgroundColor: '#e0e0e0', padding: '1rem', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '0 1rem' }}>🧠 Practice</Link>
          <Link to="/dashboard" style={{ margin: '0 1rem' }}>📊 Dashboard</Link>
        </nav>

        <div style={{ flex: 1, padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Routes>
            <Route path="/" element={<PracticeView />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
