import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SceneTitle, FeatureTile, XPBar } from './_primitives';

export function Progression() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Base UI
      setTimeout(() => setPhase(2), 2500), // XP fill 1
      setTimeout(() => setPhase(3), 4000), // Level up 1
      setTimeout(() => setPhase(4), 6000), // XP fill 2
      setTimeout(() => setPhase(5), 7500), // Level up 2 + mascot
      setTimeout(() => setPhase(6), 10000), // Streak updates
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <SceneTitle 
        headline="Daily streaks. XP. Levels." 
        sublabel="Show up. Level up." 
      />

      <div className="relative w-full max-w-4xl h-[50vh] mt-[10vh] flex items-center justify-center">
        {phase >= 1 && (
          <FeatureTile className="w-[600px] p-10 relative z-20">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-gray-400 font-bold mb-1">CURRENT LEVEL</div>
                <motion.div 
                  className="text-6xl font-black text-[#00A4FA]"
                  key={phase >= 5 ? 'lvl6' : phase >= 3 ? 'lvl5' : 'lvl4'}
                  initial={{ scale: 0.5, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  Lvl {phase >= 5 ? 6 : phase >= 3 ? 5 : 4}
                </motion.div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 font-bold mb-1">STREAK</div>
                <motion.div 
                  className="text-5xl font-black text-[#E3ED43] flex items-center gap-2"
                  key={phase >= 6 ? 'streak5' : 'streak3'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring' }}
                >
                  🔥 {phase >= 6 ? 5 : 3}
                </motion.div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-2 font-bold text-gray-500">
                <span>XP</span>
                <span>{phase >= 4 ? '1500 / 1500' : phase >= 2 ? '1000 / 1000' : '250 / 1000'}</span>
              </div>
              <XPBar progress={phase >= 4 ? 100 : phase >= 2 ? 100 : 25} />
            </div>
          </FeatureTile>
        )}

        <AnimatePresence mode="popLayout">
          {phase >= 5 && (
            <motion.img 
              src={`${import.meta.env.BASE_URL}brand/mascot_celebrate.png`}
              alt="Mascot"
              className="absolute -right-20 bottom-0 w-80 h-80 object-contain z-10 origin-bottom"
              initial={{ scale: 0, rotate: 20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </AnimatePresence>

      </div>
      
      {/* Ambient background rings */}
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            className="absolute rounded-full border border-[#00A4FA]/10"
            style={{ width: `${i * 30}vw`, height: `${i * 30}vw` }}
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}