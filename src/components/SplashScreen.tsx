import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SovoLogo } from './SovoLogo';
import { ShieldCheck, Lock } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#050507] text-[#f4f4f6] px-6 py-12 select-none overflow-hidden"
      id="sovo-splash-screen"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#d4af37]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#aa7c11]/10 blur-[100px] pointer-events-none" />

      {/* Top security tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121216] border border-[#d4af37]/20 text-[11px] font-medium text-[#d4af37] tracking-wider uppercase"
      >
        <Lock className="w-3 h-3 text-[#d4af37]" />
        <span>Quantum End-to-End Encryption</span>
      </motion.div>

      {/* Center 3D Logo and Brand */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <SovoLogo size="hero" withGlow={true} animated={true} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-gold-glossy mb-2"
        >
          S'ovo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm font-normal text-[#9e9ea7] max-w-xs leading-relaxed"
        >
          Absolute privacy. TikTok-scrolling statuses. Zero data retention.
        </motion.p>
      </div>

      {/* Bottom loading progress */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        <div className="w-full h-1 bg-[#16161c] rounded-full overflow-hidden border border-[#d4af37]/20 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#aa7c11] via-[#ffd700] to-[#fff3a8] rounded-full"
            style={{ width: `${Math.min(100, progress)}%` }}
            transition={{ ease: 'easeInOut' }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[11px] text-[#71717a]">
          <span className="flex items-center gap-1 text-[#d4af37]">
            <ShieldCheck className="w-3.5 h-3.5" /> Initializing Enclave
          </span>
          <span className="font-mono text-[#d4af37]">{Math.min(100, progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
};
