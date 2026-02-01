import React from 'react';

interface RomanticAnimationProps {
  onComplete: () => void;
}

const RomanticAnimation: React.FC<RomanticAnimationProps> = ({ onComplete }) => {
  React.useEffect(() => {
    // Animation completes after 2 seconds
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="romantic-animation">
      <div className="hearts-container">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="heart"
            style={{
              '--delay': `${i * 0.15}s`,
              '--x': `${Math.random() * 100}%`,
            } as React.CSSProperties}
          >
            ❤️
          </div>
        ))}
      </div>
      <div className="sparkles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              '--delay': `${i * 0.1}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
            } as React.CSSProperties}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  );
};

export default RomanticAnimation;
