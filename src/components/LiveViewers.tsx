'use client';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function LiveViewers() {
  const [viewers, setViewers] = useState(1245089); // Start around 1.2M

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate between -1500 and +1500 viewers every 4 seconds
      const change = Math.floor(Math.random() * 3000) - 1500;
      setViewers(prev => Math.max(100000, prev + change));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.viewerBadge}>
      <span className={styles.eyeIcon}>👁</span>
      {viewers.toLocaleString()} watching
    </div>
  );
}
