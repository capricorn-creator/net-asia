import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (progress <= 0) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[60] h-[2px]"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #3B82F6, #06B6D4, #8B5CF6)',
        boxShadow: '0 0 8px rgba(59,130,246,0.6)',
      }}
      initial={false}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.05 }}
    />
  );
}
