'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChannelList from '@/components/ChannelList';
import VideoPlayer from '@/components/VideoPlayer';
import Ticker from '@/components/Ticker';
import Particles from '@/components/Particles';
import LiveChat from '@/components/LiveChat';
import { channels } from '@/lib/channels';
import { useSubscription } from '@/hooks/useSubscription';
import Paywall from '@/components/Paywall';
import styles from '@/components/Paywall.module.css'; // For banned screen

export default function Home() {
  const [activeChannelIndex, setActiveChannelIndex] = useState(0);
  const [theaterMode, setTheaterMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'chat'>('chat');
  const activeChannel = channels[activeChannelIndex];
  
  const { deviceId, isBanned, isLocked, timeLeft } = useSubscription();

  useEffect(() => {
    if (theaterMode) {
      document.body.classList.add('theater-mode');
    } else {
      document.body.classList.remove('theater-mode');
    }
  }, [theaterMode]);

  return (
    <>
      {isBanned && (
        <div className={styles.overlay} style={{ zIndex: 999999, background: '#000' }}>
          <div className={styles.bannedScreen}>
            <h1>⚠️ BANNED ⚠️</h1>
            <p style={{ fontSize: '1.5rem', color: '#ffaaaa', fontWeight: 'bold' }}>
              Your device has been permanently blocked by the administrator due to policy violations.
            </p>
          </div>
        </div>
      )}
      
      {isLocked && deviceId && !isBanned && (
        <Paywall deviceId={deviceId} />
      )}
      
      <div className={`app-container ${theaterMode ? 'theater-mode' : ''}`}>
        <Particles />
        <Header theaterMode={theaterMode} toggleTheaterMode={() => setTheaterMode(!theaterMode)} />
        <Ticker />
        
        <main className="main-content">
          <div className="content-area">
            <VideoPlayer 
              url={activeChannel.url} 
              channelName={activeChannel.name} 
              theaterMode={theaterMode}
              toggleTheaterMode={() => setTheaterMode(!theaterMode)}
            />
            {timeLeft > 0 && !isLocked && (
              <div style={{ textAlign: 'center', marginTop: '10px', color: '#ff3366', fontWeight: 'bold' }}>
                Free Trial ends in: {Math.ceil(timeLeft / 1000)} seconds
              </div>
            )}
          </div>
          
          <aside className="sidebar-container">
            <div className="sidebar-tabs">
              <button 
                className={`tab-btn ${activeTab === 'chat' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Live Chat
              </button>
              <button 
                className={`tab-btn ${activeTab === 'channels' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('channels')}
              >
                Channels
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'channels' ? (
                <ChannelList 
                  channels={channels} 
                  activeIndex={activeChannelIndex}
                  onSelect={setActiveChannelIndex}
                />
              ) : (
                <LiveChat />
              )}
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}
