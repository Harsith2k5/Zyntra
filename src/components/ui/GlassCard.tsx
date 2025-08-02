import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glowColor?: 'mint' | 'amber' | 'rose';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverable = false,
  glowColor = 'mint'
}) => {
  const glowColors = {
    mint: 'hover:shadow-[0_0_20px_rgba(22,255,189,0.3)]',
    amber: 'hover:shadow-[0_0_20px_rgba(252,238,9,0.3)]',
    rose: 'hover:shadow-[0_0_20px_rgba(255,110,199,0.3)]'
  };

  return (
    <motion.div
      className={`
        bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${hoverable ? `cursor-pointer transition-all duration-300 ${glowColors[glowColor]}` : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02 } : {}}
      whileTap={hoverable ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;