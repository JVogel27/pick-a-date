import React from 'react';

interface RomanticAnimationProps {
  onComplete: () => void;
}

// SVG romantic symbols components
const Heart: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const Flower: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-5.5-3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM12 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-5.5-3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6 2.3-7.4-6-4.6h7.6z"/>
  </svg>
);

const Ring: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
  </svg>
);

const RomanticAnimation: React.FC<RomanticAnimationProps> = ({ onComplete }) => {
  React.useEffect(() => {
    // Animation completes after 3.5 seconds
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate spiral positions (8 spirals)
  const spiralElements = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 360;
    const radius = 70; // vh units
    const startX = Math.cos((angle * Math.PI) / 180) * radius;
    const startY = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      id: i,
      startX: `${startX}vh`,
      startY: `${startY}vh`,
      delay: `${i * 0.08}s`,
      Symbol: [Heart, Flower, Star, Ring][i % 4]
    };
  });

  // Generate burst positions (16 radial arms)
  const burstElements = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360;
    const radius = 40; // vh units
    const burstX = Math.cos((angle * Math.PI) / 180) * radius;
    const burstY = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      id: i,
      burstX: `${burstX}vh`,
      burstY: `${burstY}vh`,
      delay: `${i * 0.04}s`,
      Symbol: [Heart, Flower, Star, Ring][i % 4],
      color: i % 3 === 0 ? 'pink' : i % 3 === 1 ? 'purple' : 'peach'
    };
  });

  // Generate kaleidoscope positions (24 symmetrical)
  const kaleidoscopeElements = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const radius = 35; // vh units
    const layer = Math.floor(i / 8);
    const layerRadius = radius - (layer * 12);
    const burstX = Math.cos((angle * Math.PI) / 180) * layerRadius;
    const burstY = Math.sin((angle * Math.PI) / 180) * layerRadius;

    return {
      id: i,
      burstX: `${burstX}vh`,
      burstY: `${burstY}vh`,
      delay: `${i * 0.03}s`,
      Symbol: [Heart, Flower, Star, Ring][i % 4],
      color: i % 3 === 0 ? 'pink' : i % 3 === 1 ? 'purple' : 'peach'
    };
  });

  return (
    <div className="romantic-animation">
      {/* Phase 1: Spiral Inward (0-1.2s) */}
      <div className="spiral-phase">
        {spiralElements.map(({ id, startX, startY, delay, Symbol }) => (
          <div
            key={`spiral-${id}`}
            className="spiral-symbol"
            style={{
              '--start-x': startX,
              '--start-y': startY,
              '--delay': delay
            } as React.CSSProperties}
          >
            <Symbol className="symbol-icon" />
          </div>
        ))}
      </div>

      {/* Phase 2: Radial Burst (1.2-2.4s) */}
      <div className="burst-phase">
        {burstElements.map(({ id, burstX, burstY, delay, Symbol, color }) => (
          <div
            key={`burst-${id}`}
            className={`burst-symbol ${color}`}
            style={{
              '--burst-x': burstX,
              '--burst-y': burstY,
              '--delay': delay
            } as React.CSSProperties}
          >
            <Symbol className="symbol-icon" />
          </div>
        ))}
      </div>

      {/* Phase 3: Kaleidoscope Spin (2.4-3.5s) */}
      <div className="kaleidoscope-phase">
        {kaleidoscopeElements.map(({ id, burstX, burstY, delay, Symbol, color }) => (
          <div
            key={`kaleido-${id}`}
            className={`kaleidoscope-symbol ${color}`}
            style={{
              '--burst-x': burstX,
              '--burst-y': burstY,
              '--delay': delay
            } as React.CSSProperties}
          >
            <Symbol className="symbol-icon" />
          </div>
        ))}
      </div>

      {/* Center glow effect */}
      <div className="center-glow"></div>
    </div>
  );
};

export default RomanticAnimation;
