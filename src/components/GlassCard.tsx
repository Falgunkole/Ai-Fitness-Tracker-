/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, onClick, hoverEffect = false }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
