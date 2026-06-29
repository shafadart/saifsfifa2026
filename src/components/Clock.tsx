'use client';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as BD time (UTC+6)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className={styles.clockPlaceholder}></div>;

  return (
    <div className={styles.clock}>
      <span className={styles.clockTime}>{time}</span>
      <span className={styles.clockLabel}>BD TIME</span>
    </div>
  );
}
