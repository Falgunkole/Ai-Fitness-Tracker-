/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Camera, Search, Loader2, Salad, Plus, Check } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { analyzeFoodImage, parseFoodText } from '../services/gemini';
import { FoodEntry } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';

interface FoodScannerProps {
  onSave: (food: FoodEntry) => void;
}

export function FoodScanner({ onSave }: FoodScannerProps) {
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const base64 = await toBase64(file);
      const data = await analyzeFoodImage(base64.split(',')[1]);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextParse = async () => {
    if (!textInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await parseFoodText(textInput);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const saveEntry = () => {
    onSave({
      userId: '',
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fats: result.fats,
      timestamp: new Date()
    });
    setResult(null);
    setTextInput('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500 pb-24">
      <header>
        <h1 className="text-3xl font-black text-white">Scan Food</h1>
        <p className="text-white/60">Identify macros with AI vision.</p>
      </header>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[32px] blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <GlassCard className="p-12 flex flex-col items-center justify-center border-dashed border-2 border-white/20 hover:border-blue-500/50 transition-all shadow-xl">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageCapture}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-6 active:scale-95 transition-all shadow-lg shadow-blue-500/30 border-b-4 border-black/20"
          >
            <Camera className="w-10 h-10" />
          </button>
          <span className="text-lg font-bold text-white tracking-tight">Capture Meal</span>
          <p className="text-blue-400 text-xs mt-2 font-bold uppercase tracking-widest">AI Vision Pro v2.4</p>
        </GlassCard>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Salad className="w-5 h-5 text-blue-400" />
        </div>
        <input 
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Describe your meal..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-12 text-white font-bold placeholder-white/20 focus:ring-1 focus:ring-blue-400 transition-all"
        />
        <button 
          onClick={handleTextParse}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-500 rounded-xl text-white active:scale-90 transition-transform"
        >
          {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <GlassCard className="relative p-6 border-blue-500/30">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Detection Result</span>
                  <h3 className="text-2xl font-bold text-white">{result.name}</h3>
                </div>
                <div className="bg-purple-500/20 px-3 py-0.5 rounded-full border border-purple-500/30">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">AI Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Protein</span>
                  <span className="text-xl font-bold text-white">{result.protein}g</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Carbs</span>
                  <span className="text-xl font-bold text-white">{result.carbs}g</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Fats</span>
                  <span className="text-xl font-bold text-white">{result.fats}g</span>
                </div>
              </div>

              <button 
                onClick={saveEntry}
                className="w-full bg-blue-500 py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-bold uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-500/20"
              >
                <Check className="w-5 h-5" />
                Add to Daily Log
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">AI Neural Processing...</span>
        </div>
      )}
    </div>
  );
}
