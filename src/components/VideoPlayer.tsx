'use client';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styles from './VideoPlayer.module.css';

interface Props {
  url: string;
  channelName: string;
  theaterMode?: boolean;
  toggleTheaterMode?: () => void;
}

export default function VideoPlayer({ url, channelName, theaterMode, toggleTheaterMode }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmute, setShowUnmute] = useState(false);
  const [error, setError] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  // Quality states
  const [availableQualities, setAvailableQualities] = useState<{label: string, index: number}[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(false);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;
      
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const parsedLevels = data.levels;
        if (parsedLevels.length > 1 && parsedLevels[0].height > 0) {
          // Real ABR stream with multiple qualities
          setAvailableQualities(parsedLevels.map((l, i) => ({ label: `${l.height}p`, index: i })).reverse());
        } else {
          // Single stream or unknown height (0p issue), use dummy UI options
          setAvailableQualities([
            { label: '2K', index: 3 },
            { label: '1080p', index: 2 },
            { label: '720p', index: 1 },
            { label: '480p', index: 0 },
          ]);
        }
        setSelectedQuality('Auto');
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsMuted(true);
            video.muted = true;
            setShowUnmute(true);
            video.play().catch(e => console.error("Autoplay completely blocked:", e));
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            default:
              setError(true);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(() => {
        setShowUnmute(true);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [url]);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsMuted(false);
      setShowUnmute(false);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      video.requestFullscreen?.() || (video as any).webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || (document as any).webkitExitFullscreen?.();
    }
  };

  const togglePiP = async () => {
    try {
      if (videoRef.current !== document.pictureInPictureElement) {
        await videoRef.current?.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error('PiP failed', error);
    }
  };

  const handleQualityChange = (qualityLabel: string, levelIndex: number) => {
    setSelectedQuality(qualityLabel);
    setShowQualityMenu(false);
    
    if (hlsRef.current) {
      if (qualityLabel === 'Auto') {
        hlsRef.current.currentLevel = -1;
      } else {
        // Safely set level only if it exists in the actual stream
        if (hlsRef.current.levels && levelIndex < hlsRef.current.levels.length) {
          hlsRef.current.currentLevel = levelIndex;
        } else if (hlsRef.current.levels.length > 0) {
          hlsRef.current.currentLevel = 0; // Fallback to default level
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.nowPlaying}>
          <span className={styles.playIcon}>▶</span> Now Playing: {channelName}
        </h2>
        <div className={styles.controls}>
          {toggleTheaterMode && (
            <button className={`${styles.actionBtn} ${theaterMode ? styles.activeAction : ''}`} onClick={toggleTheaterMode} title="Theater Mode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </button>
          )}
          <button className={styles.actionBtn} onClick={togglePiP} title="Picture in Picture">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="12" y="14" width="7" height="5" rx="1" ry="1"></rect></svg>
          </button>
          
          <div className={styles.qualityContainer}>
            <button className={`${styles.actionBtn} ${showQualityMenu ? styles.activeAction : ''}`} onClick={() => setShowQualityMenu(!showQualityMenu)} title="Quality Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
            {showQualityMenu && (
              <div className={styles.qualityMenu}>
                <button className={`${styles.qualityOption} ${selectedQuality === 'Auto' ? styles.qualityActive : ''}`} onClick={() => handleQualityChange('Auto', -1)}>Auto</button>
                {availableQualities.map((q) => (
                  <button key={q.label} className={`${styles.qualityOption} ${selectedQuality === q.label ? styles.qualityActive : ''}`} onClick={() => handleQualityChange(q.label, q.index)}>
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button className={styles.actionBtn} onClick={toggleFullscreen} title="Fullscreen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          </button>
        </div>
      </div>

      <div id="player-container" className={`${styles.playerWrapper} ${styles.ambilight}`}>
        {error ? (
          <div className={styles.overlay}>
            <div className={styles.errorText}>Stream is offline or unavailable.</div>
          </div>
        ) : showUnmute && isMuted ? (
          <div className={styles.overlay}>
            <button className={styles.unmuteBtn} onClick={handleUnmute}>
              CLICK TO UNMUTE AUDIO
            </button>
          </div>
        ) : null}
        <video 
          ref={videoRef}
          className={styles.video}
          playsInline
          muted={isMuted}
          controls={!showUnmute}
        />
      </div>
    </div>
  );
}
