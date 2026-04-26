import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function IntroTagline() {
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
      <div className="flex items-center gap-4 mb-8">
        <motion.img 
          src={`${import.meta.env.BASE_URL}brand/icon.png`}
          alt="Grafly Logomark"
          className="w-16 h-16 object-contain"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.img 
          src={`${import.meta.env.BASE_URL}brand/wordmark.png`}
          alt="GRAFLY"
          className="h-10 object-contain origin-left"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>

      {phase >= 1 && (
        <motion.h1 
          className="text-5xl md:text-6xl font-black text-[#21263F] text-center max-w-4xl tracking-tight leading-tight"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Learn design by actually <span className="text-[#00A4FA]">designing.</span>
        </motion.h1>
      )}

      {/* Mascot holds from previous scene */}
      <motion.img 
        src={`${import.meta.env.BASE_URL}brand/mascot_idle.png`}
        alt="Grafly Mascot"
        className="absolute bottom-[-10vh] right-[10vw] w-64 h-64 object-contain origin-bottom"
        initial={{ y: '0%', rotate: -5 }}
        animate={{ y: '-2%', rotate: -3 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
