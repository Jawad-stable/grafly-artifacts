import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SceneTitle, FeatureTile, LeaderboardRow } from './_primitives';

export function LeaderboardsAndPro() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Show Leaderboard
      setTimeout(() => setPhase(2), 5000), // Show PRO badge
      setTimeout(() => setPhase(3), 10000), // Celebration pulse
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const leaderboardData = [
    { rank: 1, name: 'DesignMaster99', xp: 14500 },
    { rank: 2, name: 'PixelPerfect', xp: 12200 },
    { rank: 3, name: 'You', xp: 11800, isUser: true },
    { rank: 4, name: 'VectorKing', xp: 11500 },
    { rank: 5, name: 'GridLover', xp: 10900 },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <SceneTitle 
        headline="Compete weekly. Go Pro for unlimited critique." 
        sublabel="Leaderboards · Pro tier" 
      />

      <div className="relative w-full max-w-6xl h-[60vh] mt-[10vh] flex items-center justify-center gap-12 z-20">
        
        {/* Leaderboard side */}
        <div className="w-[500px] flex flex-col gap-3">
          {phase >= 1 && leaderboardData.map((row, i) => (
            <LeaderboardRow 
              key={i} 
              {...row} 
              delay={i * 0.15} 
            />
          ))}
        </div>

        {/* PRO Badge side */}
        <div className="w-[400px] flex items-center justify-center relative">
          {phase >= 2 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ 
                scale: phase >= 3 ? [1, 1.1, 1] : 1, 
                opacity: 1, 
                rotate: 0 
              }}
              transition={{ 
                type: 'spring', stiffness: 300, damping: 20,
                scale: phase >= 3 ? { duration: 0.5 } : {}
              }}
              className="bg-[#21263F] text-[#FFFEEC] p-10 rounded-3xl shadow-2xl relative overflow-hidden w-full text-center"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00A4FA] via-[#FF7BD0] to-[#E3ED43]" />
              <h2 className="text-6xl font-black mb-4 tracking-tighter">PRO</h2>
              <p className="text-2xl font-medium text-[#FFFEEC]/80">Unlimited AI Critique</p>
              <p className="text-lg mt-4 text-[#FFFEEC]/50">Level up faster.</p>
              
              {/* Shine effect */}
              <motion.div 
                className="absolute top-0 bottom-0 w-1/2 bg-white/10 -skew-x-12"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          )}
        </div>

      </div>

      {/* Persistent particle background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-30"
        animate={{ rotate: 5, scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-[#00A4FA]/20 rounded-full blur-[60px]" />
        <div className="absolute bottom-[20%] right-[20%] w-80 h-80 bg-[#FF7BD0]/20 rounded-full blur-[80px]" />
      </motion.div>
    </motion.div>
  );
}