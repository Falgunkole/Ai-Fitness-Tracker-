/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Activity, Flame, Utensils, Target } from 'lucide-react';
import { CalorieBalance, Workout, FoodEntry } from '../types';
import { cn } from '../lib/utils';

interface HomeProps {
  balance: CalorieBalance;
  workouts: Workout[];
  foods: FoodEntry[];
  user: any;
}

export function Home({ balance, workouts, foods, user }: HomeProps) {
  const intakePercentage = Math.min((balance.intake / 2000) * 100, 100); // Mock daily goal 2000
  const burnedPercentage = Math.min((balance.burned / 500) * 100, 100); // Mock daily burn goal 500

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-slate-400 text-sm font-medium">Welcome back,</h2>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {user?.displayName || 'Athlete'}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full border border-blue-500/30 p-0.5">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
            {user?.displayName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AR'}
          </div>
        </div>
      </header>

      {/* Main Goal Card */}
      <GlassCard className="relative shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">Daily Balance</p>
            <h3 className="text-4xl font-light text-white">{balance.net} <span className="text-lg text-slate-400">kcal</span></h3>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
              <motion.circle 
                cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round"
                className="text-blue-500"
                initial={{ strokeDashoffset: 175 }}
                animate={{ strokeDashoffset: 175 - (intakePercentage / 100) * 175 }}
                style={{ strokeDasharray: 175 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
              {Math.round(intakePercentage)}%
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Burned</p>
            <p className="text-lg font-medium text-white">{balance.burned}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Consumed</p>
            <p className="text-lg font-medium text-white">{balance.intake}</p>
          </div>
        </div>
      </GlassCard>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5" hoverEffect>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workouts</span>
          </div>
          <span className="text-3xl font-bold text-white">{workouts.length}</span>
          <p className="text-xs text-slate-500 mt-1">this week</p>
        </GlassCard>
        <GlassCard className="p-5" hoverEffect>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Goal</span>
          </div>
          <span className="text-lg font-bold text-white leading-tight uppercase truncate">{user?.goal?.replace('_', ' ') || 'Maintain'}</span>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <section className="space-y-4 pb-8">
        <h4 className="text-sm font-semibold text-white">Recent Activity</h4>
        <div className="space-y-3">
          {[...workouts, ...foods].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 3).map((activity, idx) => (
            <div key={idx} className="flex items-center p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mr-4",
                'exercise' in activity ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
              )}>
                {'exercise' in activity ? <Flame className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">{'exercise' in activity ? activity.exercise : activity.name}</p>
                <p className="text-[10px] text-slate-500">
                  {'exercise' in activity 
                    ? `${activity.sets.length} sets • ${activity.caloriesBurned} kcal` 
                    : `${activity.calories} kcal • Scan Verified`}
                </p>
              </div>
              <span className="text-[10px] text-slate-400">
                {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
