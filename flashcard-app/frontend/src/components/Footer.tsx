import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Flashcard Learner. All rights reserved.</p>
      <p className={styles.credit}>Built with ❤️ for learning & growth.</p>
    </footer>
  );
};

export default Footer;
