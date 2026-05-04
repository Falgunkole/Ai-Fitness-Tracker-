/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Dumbbell, Utensils, Zap, User } from 'lucide-react';
import { cn } from '../lib/utils';

type NavTab = 'home' | 'workout' | 'food' | 'insights' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'workout', icon: Dumbbell, label: 'Workout' },
    { id: 'food', icon: Utensils, label: 'Food' },
    { id: 'insights', icon: Zap, label: 'Insights' },
    { id: 'profile', icon: User, label: 'Profile' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 pt-6 pb-10 backdrop-blur-2xl border-t border-white/5">
      <div className="flex justify-around items-center px-8">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === id ? "text-blue-400" : "text-slate-500"
            )}
          >
            <div className="relative mb-1">
              {activeTab === id && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6]" />
              )}
              <Icon className={cn("w-6 h-6", activeTab === id && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
