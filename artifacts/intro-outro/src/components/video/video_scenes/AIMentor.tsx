import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SceneTitle, FeatureTile, ChatBubble } from './_primitives';

export function AIMentor() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Show UI Mockup
      setTimeout(() => setPhase(2), 2500), // Question bubble
      setTimeout(() => setPhase(3), 4500), // Thinking mascot
      setTimeout(() => setPhase(4), 6000), // Feedback bubble
      setTimeout(() => setPhase(5), 9000), // More feedback
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
        headline="Your AI design mentor" 
        sublabel="Probing questions. Personalized critique." 
      />

      <div className="relative w-full max-w-5xl h-[60vh] mt-[10vh] flex items-center justify-center">
        
        {/* Mock UI Card */}
        {phase >= 1 && (
          <FeatureTile className="w-[400px] h-[500px] absolute left-[10%] p-6 z-10">
            <div className="w-full h-32 bg-gray-200 rounded-xl mb-4" />
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-1/2 bg-gray-100 rounded mb-8" />
            <div className="h-12 w-full bg-[#00A4FA] rounded-xl mb-4" />
            <div className="h-12 w-full border-2 border-gray-200 rounded-xl" />
          </FeatureTile>
        )}

        {/* Chat area */}
        <div className="absolute right-[5%] w-[450px] flex flex-col gap-6 items-end z-20">
          {phase >= 2 && (
            <ChatBubble 
              text="Why did you put the CTA there? Is it easy to reach on mobile?" 
              align="right" 
            />
          )}
          {phase >= 4 && (
            <ChatBubble 
              text="Good thought, but placing it at the bottom would be more ergonomic." 
              align="right" 
            />
          )}
          {phase >= 5 && (
            <ChatBubble 
              text="Try moving it and see how the balance feels." 
              align="right" 
            />
          )}
        </div>

        {/* Mascot */}
        {phase >= 1 && (
          <motion.img 
            src={`${import.meta.env.BASE_URL}brand/mascot_idle.png`}
            alt="Mascot"
            className="absolute bottom-0 right-[40%] w-48 h-48 object-contain origin-bottom z-30"
            initial={{ scale: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              y: 0,
              rotate: phase >= 3 && phase < 4 ? [0, -10, 10, -10, 0] : 0 
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        )}
      </div>

      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,164,250,0.05),transparent)] pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </motion.div>
  );
}