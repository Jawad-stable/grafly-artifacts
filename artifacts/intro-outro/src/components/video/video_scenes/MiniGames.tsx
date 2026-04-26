import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SceneTitle, FeatureTile } from './_primitives';

export function MiniGames() {
  const [gameIndex, setGameIndex] = useState(0);

  const games = [
    { title: "Spot the Bad Design", type: "spot" },
    { title: "A/B Comparison", type: "ab" },
    { title: "Drag & Drop Layout", type: "dnd" },
    { title: "5-Second Test", type: "timer" }
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setGameIndex(1), 4000),
      setTimeout(() => setGameIndex(2), 8000),
      setTimeout(() => setGameIndex(3), 12000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center flex-col"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <SceneTitle 
        headline="Lessons that play like games" 
        sublabel={games[gameIndex].title} 
      />

      <div className="w-[800px] h-[500px] mt-[10vh] relative perspective-[1000px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={gameIndex}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ rotateX: -20, opacity: 0, y: 50, scale: 0.9 }}
            animate={{ rotateX: 0, opacity: 1, y: 0, scale: 1 }}
            exit={{ rotateX: 20, opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <FeatureTile className="w-full h-full p-8 flex items-center justify-center bg-white/90 backdrop-blur-xl">
              {games[gameIndex].type === 'spot' && (
                <div className="flex gap-8">
                  <div className="w-64 h-80 rounded-2xl bg-gray-100 border-4 border-red-500 relative flex items-center justify-center">
                    <div className="text-6xl">❌</div>
                    <div className="absolute inset-4 border border-dashed border-gray-300" />
                  </div>
                  <div className="w-64 h-80 rounded-2xl bg-gray-100 border-4 border-green-500 relative flex items-center justify-center">
                    <div className="text-6xl">✅</div>
                  </div>
                </div>
              )}
              {games[gameIndex].type === 'ab' && (
                <div className="flex gap-12 w-full h-full items-center justify-center">
                  <motion.div className="flex-1 h-3/4 rounded-xl bg-blue-50 flex items-center justify-center text-4xl font-bold text-blue-500"
                    whileHover={{ scale: 1.05 }}>Option A</motion.div>
                  <div className="text-4xl font-black text-gray-300">VS</div>
                  <motion.div className="flex-1 h-3/4 rounded-xl bg-purple-50 flex items-center justify-center text-4xl font-bold text-purple-500"
                    whileHover={{ scale: 1.05 }}>Option B</motion.div>
                </div>
              )}
              {games[gameIndex].type === 'dnd' && (
                <div className="w-full h-full grid grid-cols-3 gap-4">
                  <motion.div className="col-span-2 row-span-2 bg-gray-100 rounded-xl" animate={{ x: [0, 10, 0], y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                  <div className="bg-gray-100 rounded-xl" />
                  <div className="bg-gray-100 rounded-xl" />
                  <div className="col-span-3 bg-gray-100 rounded-xl" />
                </div>
              )}
              {games[gameIndex].type === 'timer' && (
                <div className="flex flex-col items-center justify-center">
                  <motion.div 
                    className="w-48 h-48 rounded-full border-8 border-gray-200 border-t-[#00A4FA] flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                  >
                    <div className="text-6xl font-black text-[#21263F]">5</div>
                  </motion.div>
                </div>
              )}
            </FeatureTile>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Background ambient motion */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/50 to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
}