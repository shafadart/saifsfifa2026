'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './LiveChat.module.css';

const MOCK_USERS = ['Alex99', 'FifaFan_BD', 'MessiGoat', 'CR7_Forever', 'FootyMaster', 'GoalDigger', 'Pele_Reborn', 'NeymarMagic', 'DhakaDynamite', 'SoccerKing'];
const MOCK_MESSAGES = [
  "What a match! 🔥",
  "Ref is blind seriously 🤦‍♂️",
  "Vamos!! 🇧🇷",
  "Who is winning rn?",
  "That was totally a foul!!",
  "Golazooooooo ⚽",
  "Stream quality is so good today ❤️",
  "Defending is terrible today smh",
  "Hahaha nice try 🤣",
  "I'm so nervous 😬",
  "Brazil all the way 🇧🇷🏆",
  "Anyone watching from Dhaka? 🇧🇩",
  "Sub him off, he is exhausted.",
];

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  isMe: boolean;
  color: string;
}

const generateRandomColor = () => {
  const colors = ['#00e5ff', '#ff2a5f', '#a855f7', '#10b981', '#f59e0b', '#3b82f6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with some fake messages
  useEffect(() => {
    const initialMessages = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() - (10000 - i * 2000),
      user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
      text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
      isMe: false,
      color: generateRandomColor(),
    }));
    setMessages(initialMessages);
  }, []);

  // Simulate incoming chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to send a message every tick
      if (Math.random() > 0.4) {
        const newMessage = {
          id: Date.now(),
          user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
          text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
          isMe: false,
          color: generateRandomColor(),
        };
        setMessages(prev => [...prev.slice(-49), newMessage]); // Keep last 50
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && messagesEndRef.current.parentElement) {
      messagesEndRef.current.parentElement.scrollTo({
        top: messagesEndRef.current.parentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const myMessage = {
      id: Date.now(),
      user: 'You',
      text: inputText.trim(),
      isMe: true,
      color: '#fff',
    };

    setMessages(prev => [...prev.slice(-49), myMessage]);
    setInputText('');
  };

  return (
    <div className={`${styles.chatContainer} glass`}>
      <div className={styles.chatHeader}>
        <h3>Live Chat</h3>
        <span className={styles.onlineBadge}>● Online</span>
      </div>
      
      <div className={styles.messagesContainer}>
        {messages.map(msg => (
          <div key={msg.id} className={`${styles.message} ${msg.isMe ? styles.myMessage : ''}`}>
            {!msg.isMe && <span className={styles.username} style={{ color: msg.color }}>{msg.user}: </span>}
            <span className={styles.text}>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Say something..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={100}
        />
        <button type="submit" disabled={!inputText.trim()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  );
}
