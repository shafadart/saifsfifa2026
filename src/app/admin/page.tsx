'use client';
import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [keys, setKeys] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'keys' | 'users'>('keys');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      fetchData(savedToken);
    }
  }, []);

  const fetchData = async (authToken: string) => {
    try {
      const [keysRes, devRes] = await Promise.all([
        fetch('/api/admin/keys', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/devices', { headers: { Authorization: `Bearer ${authToken}` } })
      ]);
      
      if (keysRes.ok && devRes.ok) {
        const keysData = await keysRes.json();
        const devData = await devRes.json();
        setKeys(keysData.keys);
        setDevices(devData.devices);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      fetchData(data.token);
    } else {
      setError(data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  const handleGenerateKey = async () => {
    if (!token) return;
    const res = await fetch('/api/admin/keys', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      setKeys([...keys, data.key]);
    }
  };

  const toggleBan = async (deviceId: string, isBanned: boolean) => {
    if (!token) return;
    const res = await fetch('/api/admin/devices', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ deviceId, action: isBanned ? 'unban' : 'ban' })
    });
    const data = await res.json();
    if (data.success) {
      setDevices(devices.map(d => d.deviceId === deviceId ? data.device : d));
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <form className={styles.loginBox} onSubmit={handleLogin}>
          <h1>Admin Login</h1>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.loginBtn}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>MaMa TV Admin Dashboard</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === 'keys' ? styles.active : ''}`} onClick={() => setActiveTab('keys')}>
            Manage Keys
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>
            Manage Users
          </button>
        </div>

        <div className={styles.card}>
          {activeTab === 'keys' ? (
            <>
              <button className={styles.generateBtn} onClick={handleGenerateKey}>
                + Generate Unique Key
              </button>
              <table>
                <thead>
                  <tr>
                    <th>Key ID</th>
                    <th>Status</th>
                    <th>Generated At</th>
                    <th>Used By (Device ID)</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {k.keyId}
                        <button 
                          onClick={() => { navigator.clipboard.writeText(k.keyId); alert('Copied!'); }}
                          style={{ background: 'rgba(0, 229, 255, 0.2)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                        >
                          Copy
                        </button>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[k.status]}`}>
                          {k.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(k.generatedAt).toLocaleString()}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{k.usedByDeviceId || '-'}</td>
                    </tr>
                  ))}
                  {keys.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No keys generated yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Device ID</th>
                    <th>Status</th>
                    <th>Active Key</th>
                    <th>First Visited</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.filter(d => d.activeKey).map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{d.deviceId}</td>
                      <td>
                        <span className={`${styles.badge} ${d.isBanned ? styles.banned : styles.active}`}>
                          {d.isBanned ? 'BANNED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--primary)' }}>
                        {d.activeKey || '-'}
                      </td>
                      <td>{new Date(d.firstAccessed).toLocaleString()}</td>
                      <td>
                        <button 
                          className={`${styles.actionBtn} ${d.isBanned ? styles.unban : styles.ban}`}
                          onClick={() => toggleBan(d.deviceId, d.isBanned)}
                        >
                          {d.isBanned ? 'Unban Device' : 'Ban Device'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {devices.filter(d => d.activeKey).length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No users have unlocked the website yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
