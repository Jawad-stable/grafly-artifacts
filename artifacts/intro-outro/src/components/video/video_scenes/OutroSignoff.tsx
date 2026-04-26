import { motion } from 'framer-motion';

export function OutroSignoff() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center flex-col"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <div className="flex items-center gap-6 mb-8">
        <motion.img 
          src={`${import.meta.env.BASE_URL}brand/icon.png`}
          alt="Grafly Logomark"
          className="w-24 h-24 object-contain"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.img 
          src={`${import.meta.env.BASE_URL}brand/wordmark.png`}
          alt="GRAFLY"
          className="h-16 object-contain origin-left"
          initial={{ scaleX: 0.8, opacity: 0, x: -20 }}
          animate={{ scaleX: 1, opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
        />
      </div>

      <motion.p 
        className="text-3xl font-medium text-[#21263F]/80 tracking-wide"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        Learn design by actually designing.
      </motion.p>
      
      <motion.div className="absolute w-8 h-8 rounded-full bg-[#E3ED43] mix-blend-multiply opacity-60 right-[25vw] top-[30vh]"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }} />
    </motion.div>
  );
}
