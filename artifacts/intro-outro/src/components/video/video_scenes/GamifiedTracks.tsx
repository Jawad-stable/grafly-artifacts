import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SceneTitle } from './_primitives';

export function GamifiedTracks() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 6500),
      setTimeout(() => setPhase(6), 8000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const nodes = [
    { id: 1, title: 'Design Principles', x: '20%', y: '40%' },
    { id: 2, title: 'Typography', x: '40%', y: '60%' },
    { id: 3, title: 'UI Design', x: '60%', y: '30%' },
    { id: 4, title: 'Branding', x: '80%', y: '50%' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <SceneTitle 
        headline="Skill trees that grow with you" 
        sublabel="Design Principles · Typography · UI Design · Branding" 
      />

      <div className="relative w-[60vw] h-[50vh] mt-[10vh]">
        {/* Lines — viewBox uses 0-100 user units to match the percentage-positioned nodes below */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <motion.path 
            d="M 20 40 L 40 60 L 60 30 L 80 50" 
            vectorEffect="non-scaling-stroke"
            fill="none" 
            stroke="#21263F" 
            strokeWidth="4" 
            strokeOpacity="0.1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 3, ease: 'linear' }}
          />
          <motion.path 
            d="M 20 40 L 40 60 L 60 30 L 80 50" 
            vectorEffect="non-scaling-stroke"
            fill="none" 
            stroke="#00A4FA" 
            strokeWidth="6" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase >= 2 ? Math.min((phase - 1) * 0.33, 1) : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.div 
            key={node.id}
            className="absolute flex flex-col items-center"
            style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: phase >= i + 1 ? 1 : 0, opacity: phase >= i + 1 ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-white ${phase >= i + 2 ? 'border-[#00A4FA] shadow-[0_0_20px_rgba(0,164,250,0.4)]' : 'border-[#21263F]/20'}`}
              animate={{ 
                scale: phase >= i + 2 ? [1, 1.2, 1] : 1,
                borderColor: phase >= i + 2 ? '#00A4FA' : 'rgba(33,38,63,0.2)'
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-8 h-8 rounded-full ${phase >= i + 2 ? 'bg-[#00A4FA]' : 'bg-[#21263F]/10'}`} />
            </motion.div>
            <motion.div 
              className="mt-4 text-xl font-bold text-[#21263F] whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase >= i + 2 ? 1 : 0.4, y: 0 }}
            >
              {node.title}
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Background ambient continuous motion to prevent static tail */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-50"
        animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(15deg)', 'hue-rotate(0deg)'] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </motion.div>
  );
}