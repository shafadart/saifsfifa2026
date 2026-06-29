'use client';
import { useState } from 'react';
import styles from './ChannelList.module.css';
import { Channel } from '@/lib/channels';
import Image from 'next/image';

interface Props {
  channels: Channel[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ChannelList({ channels, activeIndex, onSelect }: Props) {
  const [search, setSearch] = useState('');

  const filteredChannels = channels.map((ch, i) => ({ ...ch, originalIndex: i }))
    .filter(ch => ch.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`${styles.sidebar} glass`}>
      <div className={styles.header}>
        <h3>📺 Channels</h3>
        <span className={styles.subtitle}>Keyboard: ↑↓ arrows</span>
      </div>
      
      <div className={styles.searchBox}>
        <input 
          type="text" 
          placeholder="Search channel..." 
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.list}>
        {filteredChannels.map((ch) => (
          <div 
            key={ch.originalIndex}
            className={`${styles.card} ${activeIndex === ch.originalIndex ? styles.active : ''}`}
            onClick={() => onSelect(ch.originalIndex)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(ch.originalIndex)}
          >
            <div className={styles.cardInfo}>
              <div className={styles.logoWrapper}>
                <Image src={ch.logo} alt={ch.name} fill className={styles.chLogo} unoptimized />
              </div>
              <span className={styles.chName}>{ch.name}</span>
            </div>
            <span className={styles.chNum}>CH {ch.originalIndex + 1}</span>
          </div>
        ))}
        {filteredChannels.length === 0 && (
          <div className={styles.noResults}>No channels found</div>
        )}
      </div>
    </div>
  );
}
