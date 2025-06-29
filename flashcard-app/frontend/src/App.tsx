/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PracticeView from './components/PracticeView';
import Dashboard from './components/Dashboard';
import ReviewHistory from './components/ReviewHistory';
import { ToastContainer } from 'react-toastify';
import RetryView from './components/RetryView';
import 'react-toastify/dist/ReactToastify.css';
import DeckList from './components/DeckList';
import DeckDetails from './components/DeckDetails';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FlashcardForm from './components/FlashcardForm';
import CreateCardForm from './components/CreateCardForm';
import Header from './components/Header';
import Footer from './components/Footer'; // ✅ import Footer

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<PracticeView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<ReviewHistory />} />
            <Route path="/retry" element={<RetryView />} />
            <Route path="/decks" element={<DeckList />} />
            <Route path="/decks/:deckId" element={<DeckDetails />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/flash" element={<FlashcardForm />} />
            <Route path="/create" element={<CreateCardForm />} />
          </Routes>
        </div>

        <Footer /> {/* ✅ Footer added here */}

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
