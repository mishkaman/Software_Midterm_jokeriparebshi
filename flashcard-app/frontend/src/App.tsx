import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PracticeView from './components/PracticeView';
import Dashboard from './components/Dashboard';
import ReviewHistory from './components/ReviewHistory'; // ✅ New import
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav style={{ backgroundColor: '#e0e0e0', padding: '1rem', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '0 1rem' }}>🧠 Practice</Link>
          <Link to="/dashboard" style={{ margin: '0 1rem' }}>📊 Dashboard</Link>
          <Link to="/history" style={{ margin: '0 1rem' }}>🕒 History</Link> {/* ✅ */}
        </nav>

        <div style={{ flex: 1, padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Routes>
            <Route path="/" element={<PracticeView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<ReviewHistory />} /> {/* ✅ */}
          </Routes>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
