import { motion } from 'framer-motion';

export function SceneTitle({ headline, sublabel }: { headline: string, sublabel: string }) {
  return (
    <div className="absolute top-[15vh] left-0 w-full text-center z-20 flex flex-col items-center">
      <motion.h2 
        className="text-5xl md:text-6xl font-black text-[#21263F] tracking-tight leading-tight max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {headline}
      </motion.h2>
      <motion.p 
        className="text-2xl text-[#00A4FA] font-medium mt-4 tracking-wide"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {sublabel}
      </motion.p>
    </div>
  );
}

export function FeatureTile({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      className={`bg-white rounded-3xl shadow-xl border border-[#21263F]/5 overflow-hidden flex flex-col ${className}`}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

export function ChatBubble({ text, align = 'left', delay = 0 }: { text: string, align?: 'left' | 'right', delay?: number }) {
  const isRight = align === 'right';
  return (
    <motion.div 
      className={`max-w-[80%] rounded-2xl px-6 py-4 text-xl shadow-sm ${isRight ? 'bg-[#00A4FA] text-white self-end rounded-br-sm' : 'bg-white text-[#21263F] border border-[#21263F]/10 self-start rounded-bl-sm'}`}
      initial={{ opacity: 0, scale: 0.8, x: isRight ? 20 : -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay }}
    >
      {text}
    </motion.div>
  );
}

export function XPBar({ progress, delay = 0 }: { progress: number, delay?: number }) {
  return (
    <div className="w-full bg-[#21263F]/5 rounded-full h-4 overflow-hidden relative">
      <motion.div 
        className="absolute top-0 left-0 h-full bg-[#00A4FA] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay }}
      />
    </div>
  );
}

export function CoinPill({ value, delay = 0 }: { value: number, delay?: number }) {
  return (
    <motion.div 
      className="flex items-center gap-2 bg-[#E3ED43] text-[#21263F] px-4 py-2 rounded-full font-bold shadow-md"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay }}
    >
      <div className="w-5 h-5 rounded-full bg-[#21263F]/10 flex items-center justify-center text-xs">C</div>
      <span>{value}</span>
    </motion.div>
  );
}

export function LeaderboardRow({ rank, name, xp, isUser = false, delay = 0 }: { rank: number, name: string, xp: number, isUser?: boolean, delay?: number }) {
  return (
    <motion.div 
      className={`flex items-center gap-4 p-4 rounded-2xl w-full ${isUser ? 'bg-[#00A4FA]/10 border border-[#00A4FA]/30' : 'bg-white border border-[#21263F]/5'}`}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay }}
    >
      <div className={`text-xl font-bold w-8 text-center ${isUser ? 'text-[#00A4FA]' : 'text-[#21263F]/40'}`}>
        {rank}
      </div>
      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-[#21263F]/40 font-bold bg-[#21263F]/5">
        {name.charAt(0)}
      </div>
      <div className="flex-1 text-xl font-medium text-[#21263F]">{name}</div>
      <div className={`text-xl font-bold ${isUser ? 'text-[#00A4FA]' : 'text-[#21263F]/60'}`}>
        {xp} XP
      </div>
    </motion.div>
  );
}