import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { IntroMark } from './video_scenes/IntroMark';
import { IntroLockup } from './video_scenes/IntroLockup';
import { IntroTagline } from './video_scenes/IntroTagline';
import { OutroThanks } from './video_scenes/OutroThanks';
import { OutroSignoff } from './video_scenes/OutroSignoff';

/* 
Motion Vocabulary (Shared System):
- Default easing: [0.16, 1, 0.3, 1] (cubic ease-out) for most enters/exits. Soft, confident, not overly bouncy.
- Accent spring: { type: 'spring', stiffness: 320, damping: 22 } for mascot entrance and wordmark settle.
- Entrance treatment: Elements scale-in from ~0.85 with opacity 0 -> 1 over 0.5-0.7s, with subtle y offset. Mascot uses bouncier spring; wordmark uses smooth ease-out.
- Exit treatment: Soft scale (0.96) + opacity fade over ~0.4s, OR clip-path reveal away.
- Continuous ambient motion: Drifting Grafly-blue dots/circles slowly move across the cream background on 4-8s loops.
*/

const SCENE_DURATIONS = {
  // INTRO (~7s total)
  intro_mark:    1800,  // brand icon animates in, ambient particles begin
  intro_lockup:  2400,  // wordmark resolves alongside mark, mascot enters
  intro_tagline: 2800,  // tagline "Learn design by actually designing." resolves and holds
  // OUTRO (~6s total)
  outro_thanks:  2400,  // celebrate-mascot enters, "Thanks for watching" appears
  outro_signoff: 3200,  // wordmark + tagline echo, hold on a clean freeze frame
};

const SCENE_COMPONENTS = [IntroMark, IntroLockup, IntroTagline, OutroThanks, OutroSignoff];

export default function VideoTemplate() {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations: SCENE_DURATIONS, loop: false });
  const SceneComponent = SCENE_COMPONENTS[currentScene];

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      style={{ 
        background: 'radial-gradient(circle at 50% 50%, #FFFEEC 0%, #F5FDFD 100%)',
      }}
    >
      {/* Persistent Background Layer - Drift ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.12] bg-[#00A4FA]"
          animate={{ x: ['10vw', '40vw', '10vw'], y: ['-10vh', '50vh', '-10vh'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.08] bg-[#00A4FA]"
          animate={{ x: ['80vw', '30vw', '80vw'], y: ['80vh', '20vh', '80vh'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Floating small particles */}
        <motion.div className="absolute w-4 h-4 rounded-full bg-[#00A4FA]/20"
          animate={{ y: ['20vh', '80vh'], x: ['20vw', '30vw'], opacity: [0, 0.4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div className="absolute w-3 h-3 rounded-full bg-[#00A4FA]/30"
          animate={{ y: ['70vh', '10vh'], x: ['70vw', '60vw'], opacity: [0, 0.3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
