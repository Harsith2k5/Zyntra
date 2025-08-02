import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  glowColor?: 'mint' | 'amber' | 'rose';
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  glowColor = 'mint'
}) => {
  const variants = {
    primary: 'bg-[#16FFBD] text-black font-semibold hover:bg-[#16FFBD]/90',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    outline: 'border-2 border-[#16FFBD] text-[#16FFBD] hover:bg-[#16FFBD]/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const glowColors = {
    mint: 'hover:shadow-[0_0_20px_rgba(22,255,189,0.4)]',
    amber: 'hover:shadow-[0_0_20px_rgba(252,238,9,0.4)]',
    rose: 'hover:shadow-[0_0_20px_rgba(255,110,199,0.4)]'
  };

  return (
    <motion.button
      className={`
        ${variants[variant]} ${sizes[size]} ${glowColors[glowColor]}
        rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;