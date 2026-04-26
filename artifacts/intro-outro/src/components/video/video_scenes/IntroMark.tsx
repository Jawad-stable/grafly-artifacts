import { motion } from 'framer-motion';

export function IntroMark() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}brand/icon.png`}
        alt="Grafly Logomark"
        className="w-32 h-32 object-contain"
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] 
        }}
      />
    </motion.div>
  );
}
