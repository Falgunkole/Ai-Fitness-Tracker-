/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Brain, TrendingUp, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { generateFitnessInsights } from '../services/gemini';
import { Insight, Workout, FoodEntry } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface InsightsProps {
  user: any;
  workouts: Workout[];
  foods: FoodEntry[];
}

export function Insights({ user, workouts, foods }: InsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for chart - in a real app this would be aggregated from Firestore
  const chartData = [
    { day: 'Mon', burn: 2100, intake: 1800 },
    { day: 'Tue', burn: 2400, intake: 2200 },
    { day: 'Wed', burn: 1900, intake: 1700 },
    { day: 'Thu', burn: 2600, intake: 2100 },
    { day: 'Fri', burn: 2200, intake: 1900 },
    { day: 'Sat', burn: 1800, intake: 2400 },
    { day: 'Sun', burn: 2300, intake: 2000 },
  ];

  const fetchInsights = async () => {
    if (workouts.length === 0 && foods.length === 0) return;
    setIsLoading(true);
    try {
      const data = await generateFitnessInsights(user, workouts.slice(0, 5), foods.slice(0, 5));
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in zoom-in-95 duration-700">
      <header>
        <h1 className="text-3xl font-black text-white">Daily Insights</h1>
        <p className="text-white/60">Metabolic performance analysis.</p>
      </header>

      {/* Chart Section */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black text-white">Weekly Performance</h3>
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Daily Burn vs Intake</p>
            </div>
            <div className="bg-cyan-400/20 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>

        <div className="h-64 px-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="burn" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBurn)" strokeWidth={3} />
              <Area type="monotone" dataKey="intake" stroke="#9333ea" fillOpacity={1} fill="url(#colorIntake)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 pt-0 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </GlassCard>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5 border-l-4 border-l-blue-500" hoverEffect>
          <TrendingUp className="w-5 h-5 text-blue-400 mb-3" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consistency</span>
          <p className="text-2xl font-bold text-white mt-1">85%</p>
        </GlassCard>
        <GlassCard className="p-5 border-l-4 border-l-purple-500" hoverEffect>
          <Zap className="w-5 h-5 text-purple-400 mb-3" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Efficiency</span>
          <p className="text-2xl font-bold text-white mt-1">+12%</p>
        </GlassCard>
      </div>

      {/* AI Suggestions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Smart Insights</h2>
          </div>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">AI Ready</span>
        </div>

        <div className="space-y-3">
          {insights.length > 0 ? insights.map((insight, idx) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
            >
              <GlassCard className={cn(
                "p-5 flex gap-5 items-start border-white/5",
                "bg-gradient-to-r from-blue-600/5 to-purple-600/5"
              )}>
                <div className={cn(
                   "p-3 rounded-2xl flex-shrink-0",
                   insight.type === 'recovery' ? "bg-blue-500/20 text-blue-400" : 
                   insight.type === 'nutrition' ? "bg-purple-500/20 text-purple-400" : "bg-orange-500/20 text-orange-400"
                )}>
                  {insight.type === 'recovery' ? <Zap className="w-5 h-5" /> : 
                   insight.type === 'nutrition' ? <TrendingUp className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 tracking-tight">
                    <span className="text-blue-400 mr-2">AI Suggestion:</span>
                    {insight.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{insight.message}</p>
                </div>
              </GlassCard>
            </motion.div>
          )) : (
            <div className="py-12 text-center text-slate-600">
              <p className="font-bold uppercase tracking-widest text-[10px]">Log activity to unlock AI insights</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
