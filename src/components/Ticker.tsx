'use client';
import { useState, useEffect } from 'react';
import styles from './Ticker.module.css';

export default function Ticker() {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    // Next Match: Brazil vs Japan @ June 29, 2026 23:00:00 GMT+6 (11:00 PM BD Time)
    const targetDate = new Date('2026-06-29T23:00:00+06:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft('LIVE NOW!');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerLabel}>NEXT MATCH</div>
      <div className={styles.tickerContent}>
        <div className={styles.countdownText}>
          <span className={styles.matchup}>Brazil 🇧🇷 vs 🇯🇵 Japan</span>
          <span className={styles.separator}>|</span>
          <span className={styles.timeInfo}>Today, 11:00 PM (BD Time)</span>
          <span className={styles.separator}>|</span>
          <span className={styles.timer}>Starts in: <strong>{timeLeft || '...'}</strong></span>
        </div>
      </div>
    </div>
  );
}
