import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SceneTitle, FeatureTile, CoinPill } from './_primitives';

export function ShopAndCoins() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Counter
      setTimeout(() => setPhase(2), 2500), // Shop items
      setTimeout(() => setPhase(3), 4500), // Purchase animation
      setTimeout(() => setPhase(4), 7000), // Item unlocked
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const shopItems = [
    { name: "Cool Purple", img: "mascot_cool_purple.png", price: 500 },
    { name: "Cool Yellow", img: "mascot_cool_yellow.png", price: 500 },
    { name: "Celebrate", img: "mascot_celebrate.png", price: 1000 }
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <SceneTitle 
        headline="Earn coins. Spend on style." 
        sublabel="Cosmetics. Lives. Power-ups." 
      />

      <div className="absolute top-[25vh] right-[10vw] z-30">
        {phase >= 1 && <CoinPill value={phase >= 3 ? 1500 : 2000} />}
      </div>

      <div className="relative w-full max-w-5xl h-[50vh] mt-[15vh] flex items-center justify-center gap-8 z-20">
        {phase >= 2 && shopItems.map((item, i) => (
          <FeatureTile 
            key={i} 
            className="w-72 p-6 flex flex-col items-center relative overflow-visible"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <div className="h-40 w-full mb-6 relative flex items-center justify-center bg-gray-50 rounded-2xl">
                <img 
                  src={`${import.meta.env.BASE_URL}brand/${item.img}`} 
                  alt={item.name} 
                  className="h-32 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.name}</h3>
              
              <div className={`px-6 py-2 rounded-full font-bold w-full text-center ${phase >= 4 && i === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {phase >= 4 && i === 0 ? 'Equipped' : `${item.price} Coins`}
              </div>
            </motion.div>
          </FeatureTile>
        ))}

        {/* Flying coin */}
        {phase === 3 && (
          <motion.div 
            className="absolute z-50 pointer-events-none"
            initial={{ top: '-10vh', left: '100vw', scale: 1 }}
            animate={{ top: '20vh', left: '20vw', scale: 0.5, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeIn' }}
          >
            <div className="w-12 h-12 bg-[#E3ED43] rounded-full shadow-lg border-4 border-white flex items-center justify-center font-bold text-xl">C</div>
          </motion.div>
        )}
      </div>

      {/* Ambient background element */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(227,237,67,0.1),transparent_50%)]"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </motion.div>
  );
}