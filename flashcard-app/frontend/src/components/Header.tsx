// src/components/Header.tsx
import React from 'react';
import styles from './PracticeView.module.css';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className={styles.headerBar}>
      <div className={styles.logo}>📚 Flashcard Learner</div>

      <nav className={styles.navLinks}>
        <Link to="/" className={styles.navItem}>🧠 Practice</Link>
        <Link to="/dashboard" className={styles.navItem}>📊 Dashboard</Link>
        <Link to="/history" className={styles.navItem}>🕒 History</Link>
        <Link to="/retry" className={styles.navItem}>🔁 Retry</Link>
        <Link to="/decks" className={styles.navItem}>📚 Decks</Link>
        <Link to="/analytics" className={styles.navItem}>📈 Analytics</Link>
        <Link to="/create" className={styles.navItem}>➕ Create</Link>
      </nav>
    </header>
  );
};

export default Header;
