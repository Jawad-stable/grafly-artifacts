import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function OutroThanks() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center flex-col"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <motion.h1 
        className="text-6xl md:text-8xl font-black text-[#21263F] tracking-tight z-10"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 25 }}
      >
        Thanks for watching
      </motion.h1>

      {phase >= 1 && (
        <motion.img 
          src={`${import.meta.env.BASE_URL}brand/mascot_celebrate.png`}
          alt="Grafly Mascot Celebrate"
          className="absolute bottom-[-5vh] w-80 h-80 object-contain origin-bottom"
          initial={{ y: '100%', scale: 0.8 }}
          animate={{ y: '0%', scale: 1 }}
          exit={{ opacity: 0, y: '20%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        />
      )}
    </motion.div>
  );
}
