import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PracticeView from './components/PracticeView';
import Dashboard from './components/Dashboard';
import ReviewHistory from './components/ReviewHistory';
import { ToastContainer } from 'react-toastify';
import RetryView from './components/retryView';
import 'react-toastify/dist/ReactToastify.css';
import DeckList from './components/DeckList';
import DeckDetails from './components/DeckDetails';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FlashcardForm from './components/FlashcardForm';




function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav style={{ backgroundColor: '#e0e0e0', padding: '1rem', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '0 1rem' }}>🧠 Practice</Link>
          <Link to="/dashboard" style={{ margin: '0 1rem' }}>📊 Dashboard</Link>
          <Link to="/history" style={{ margin: '0 1rem' }}>🕒 History</Link> 
          <Link to="/retry" style={{ margin: '0 1rem' }}>🔁 Retry Failed</Link>
          <Link to="/decks" style={{ margin: '0 1rem' }}>📚 Decks</Link>
          <Link to="/analytics" style={{ margin: '0 1rem' }}>📈 Analytics</Link>
          <Link to="/create" style={{ margin: '0 1rem' }}>➕ New Flashcard</Link>          
        </nav>

        <div style={{ flex: 1, padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Routes>
            <Route path="/" element={<PracticeView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<ReviewHistory />} />
            <Route path="/retry" element={<RetryView />} /> 
            <Route path="/decks" element={<DeckList />} />
            <Route path="/decks/:deckId" element={<DeckDetails />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/create" element={<FlashcardForm />} />
            <Route path="/history" element={<ReviewHistory />} />
          </Routes>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
