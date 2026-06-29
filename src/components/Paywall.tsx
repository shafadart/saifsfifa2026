'use client';
import { useState } from 'react';
import styles from './Paywall.module.css';

interface Props {
  deviceId: string;
}

export default function Paywall({ deviceId }: Props) {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Number copied: ' + text);
  };

  const verifyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/client/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, key: keyInput.trim() })
      });
      const data = await res.json();
      
      if (data.success) {
        window.location.reload(); // Reload to clear lock and refresh stream
      } else {
        setError(data.error || 'Invalid key');
      }
    } catch (err) {
      setError('Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(`Hello Admin, I have sent money. My Device ID is: ${deviceId}. Please send my Unique Key.`);
  const whatsappUrl = `https://wa.me/8801861838825?text=${whatsappMessage}`; 

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Free Trial Expired!</h2>
        <p className={styles.subtitle}>
          Your 2-minute free trial has ended. To continue watching all matches in HD, please purchase a 7-day subscription.
        </p>

        <div className={styles.paymentBox}>
          <h3>
            Payment Instructions 
            <span className={styles.highlightPrice}>Send Money 199 Tk</span>
          </h3>
          
          <div className={styles.method}>
            <div>bKash (Personal)</div>
            <span>01784309362</span>
            <button className={styles.copyBtn} onClick={() => handleCopy('01784309362')}>Copy</button>
          </div>
          
          <div className={styles.method}>
            <div>Nagad (Personal)</div>
            <span>01784309362</span>
            <button className={styles.copyBtn} onClick={() => handleCopy('01784309362')}>Copy</button>
          </div>

          <div className={styles.method}>
            <div>Rocket (Personal)</div>
            <span>017843093624</span>
            <button className={styles.copyBtn} onClick={() => handleCopy('017843093624')}>Copy</button>
          </div>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          Send Screenshot on WhatsApp
        </a>

        <form className={styles.keyForm} onSubmit={verifyKey}>
          {error && <div className={styles.error}>{error}</div>}
          <input 
            type="text" 
            className={styles.keyInput} 
            placeholder="Enter Unique Key (e.g. VIP-ABCD-EFGH)"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn} disabled={loading || !keyInput.trim()}>
            {loading ? 'Verifying...' : 'Unlock Website'}
          </button>
        </form>
      </div>
    </div>
  );
}
