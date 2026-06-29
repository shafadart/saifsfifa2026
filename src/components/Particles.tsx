'use client';
import { useEffect, useState } from 'react';

export default function Particles() {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate 20 particles
    setParticles(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  return (
    <div className="particles">
      {particles.map((i) => (
        <div 
          key={i} 
          className="particle" 
          style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 20}s`,
            opacity: Math.random() * 0.5 + 0.2
          }} 
        />
      ))}
    </div>
  );
}
