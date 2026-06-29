'use client';
import { useState, useEffect } from 'react';

export const useSubscription = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isBanned, setIsBanned] = useState(false);
  const [hasValidKey, setHasValidKey] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0); // remaining trial time in ms

  const TWO_MINUTES = 2 * 60 * 1000;

  useEffect(() => {
    // Generate or get Device ID
    let id = localStorage.getItem('deviceId');
    if (!id) {
      id = 'DEV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      localStorage.setItem('deviceId', id);
    }
    setDeviceId(id);

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/client/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId: id })
        });
        const data = await res.json();
        
        setIsBanned(data.isBanned);
        setHasValidKey(data.hasValidKey);

        if (!data.hasValidKey && !data.isBanned) {
          // Check 2 minute trial
          const elapsed = Date.now() - data.firstAccessed;
          const remaining = TWO_MINUTES - elapsed;
          if (remaining <= 0) {
            setIsLocked(true);
            setTimeLeft(0);
          } else {
            setIsLocked(false);
            setTimeLeft(remaining);
          }
        } else {
          setIsLocked(false); // Unlocked because they have a valid key (or they are banned, which is handled separately)
        }
      } catch (err) {
        console.error('Failed to sync', err);
      }
    };

    checkStatus();
    // OPTIMIZATION: Poll every 3 minutes (180,000 ms) instead of 10 seconds.
    // This reduces Firebase reads by 18x, easily supporting thousands of viewers on the Free Tier!
    const interval = setInterval(checkStatus, 180000);
    
    // Smooth countdown timer
    const countdown = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  // Update lock state immediately when countdown hits 0
  useEffect(() => {
    if (timeLeft <= 0 && !hasValidKey && deviceId) {
      setIsLocked(true);
    }
  }, [timeLeft, hasValidKey, deviceId]);

  return { deviceId, isBanned, hasValidKey, isLocked, timeLeft };
};
