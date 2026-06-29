import styles from './Header.module.css';
import Image from 'next/image';
import Clock from './Clock';
import LiveViewers from './LiveViewers';

interface Props {
  theaterMode: boolean;
  toggleTheaterMode: () => void;
}

export default function Header({ theaterMode, toggleTheaterMode }: Props) {
  return (
    <header className={`${styles.header} glass`}>
      <div className={styles.logoContainer}>
        <Image src="/assets/fifalogo.png" alt="FIFA Logo" width={40} height={40} className={styles.logoImage} />
        <div className={styles.logoText}>
          <h2>MaMa TV</h2>
          <span className={styles.highlight}>Powered by Saif Dart</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <LiveViewers />
        <Clock />
        <div className="live-badge">
          <span className="dot"></span>
          LIVE NOW
        </div>
      </div>
    </header>
  );
}
