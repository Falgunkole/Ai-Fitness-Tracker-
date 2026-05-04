/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Search, Plus, Save, History, ChevronDown } from 'lucide-react';
import { WorkoutSet, Workout } from '../types';
import { adjustCalorieBurn } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface WorkoutLoggerProps {
  onSave: (workout: Workout) => void;
  weight: number;
}

export function WorkoutLogger({ onSave, weight }: WorkoutLoggerProps) {
  const [exercise, setExercise] = useState('Hammer Curls');
  const [variation, setVariation] = useState('Alternating Dumbbell');
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 0, weight: 0 }]);
  const [isCalculating, setIsCalculating] = useState(false);

  const addSet = () => setSets([...sets, { reps: 0, weight: 0 }]);
  
  const updateSet = (index: number, field: keyof WorkoutSet, value: number) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSave = async () => {
    setIsCalculating(true);
    try {
      // Basic MET duration calculation: assume 5 mins per set including rest
      const estimatedDuration = sets.length * 5; 
      const burnData = await adjustCalorieBurn(exercise, estimatedDuration, intensity, weight);
      
      onSave({
        userId: '', // Will be filled from App
        exercise,
        variation,
        sets,
        caloriesBurned: burnData.adjustedCalories,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Failed to calculate burn:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-3xl font-black text-white">Log Workout</h1>
        <p className="text-white/60">Track your progress and intensity.</p>
      </header>

      {/* Exercise Search */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-blue-400" />
        <input 
          type="text" 
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Search exercises..."
          className="bg-transparent border-none text-white focus:ring-0 w-full font-bold placeholder-white/20"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-white font-bold">{variation}</span>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-white/40">Intensity</span>
          <select 
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as any)}
            className="bg-transparent border-none text-blue-400 font-black uppercase text-xs focus:ring-0 p-0"
          >
            <option value="low">Low</option>
            <option value="moderate">Mod</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Sets List */}
      <div className="space-y-4">
        <AnimatePresence>
          {sets.map((set, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={idx}
            >
              <GlassCard className="p-4 relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Set {String(idx + 1).padStart(2, '0')}</span>
                  <History className="w-4 h-4 text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase">Reps</label>
                    <input 
                      type="number"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(idx, 'reps', parseInt(e.target.value) || 0)}
                      className="bg-white/5 border border-white/5 rounded-xl p-4 text-center text-xl font-black text-white w-full focus:ring-1 focus:ring-blue-400 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase">Weight (kg)</label>
                    <input 
                      type="number"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(idx, 'weight', parseFloat(e.target.value) || 0)}
                      className="bg-white/5 border border-white/5 rounded-xl p-4 text-center text-xl font-black text-white w-full focus:ring-1 focus:ring-blue-400 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={addSet}
          className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white/40 hover:bg-white/5 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase text-xs tracking-widest">Add Another Set</span>
        </button>
      </div>

      {/* FAB Save */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSave}
        disabled={isCalculating}
        className="fixed bottom-28 right-6 w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white z-50 disabled:opacity-50"
      >
        {isCalculating ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}
