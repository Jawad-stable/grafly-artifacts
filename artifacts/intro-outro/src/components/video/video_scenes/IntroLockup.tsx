import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function IntroLockup() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <div className="flex items-center gap-6">
        <motion.img 
          src={`${import.meta.env.BASE_URL}brand/icon.png`}
          alt="Grafly Logomark"
          className="w-32 h-32 object-contain"
          initial={{ scale: 0.9, opacity: 0, x: 50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {phase >= 1 && (
          <div className="relative">
            <motion.img 
              src={`${import.meta.env.BASE_URL}brand/wordmark.png`}
              alt="GRAFLY"
              className="h-20 object-contain origin-left"
              initial={{ scaleX: 0.8, opacity: 0, x: -20 }}
              animate={{ scaleX: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            />
            {/* Optional flourish underline */}
            {phase >= 2 && (
               <motion.svg className="absolute -bottom-2 left-0 w-full h-4 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <motion.path 
                   d="M 0,5 Q 50,10 100,2" 
                   fill="none" 
                   stroke="#00A4FA" 
                   strokeWidth="4"
                   strokeLinecap="round"
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 />
               </motion.svg>
            )}
          </div>
        )}
      </div>

      {/* Mascot Enters */}
      {phase >= 1 && (
        <motion.img 
          src={`${import.meta.env.BASE_URL}brand/mascot_idle.png`}
          alt="Grafly Mascot"
          className="absolute bottom-[-10vh] right-[10vw] w-64 h-64 object-contain origin-bottom"
          initial={{ y: '100%', rotate: 10 }}
          animate={{ y: '0%', rotate: -5 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        />
      )}
    </motion.div>
  );
}
