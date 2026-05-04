/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { WorkoutLogger } from './components/WorkoutLogger';
import { FoodScanner } from './components/FoodScanner';
import { Insights } from './components/Insights';
import { AppUser, Workout, FoodEntry, CalorieBalance } from './types';
import { GlassCard } from './components/GlassCard';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user] = useState<AppUser | null>({
    uid: 'guest_user',
    email: 'guest@example.com',
    displayName: 'Alex Rivera',
    weight: 75,
    goal: 'gain_muscle',
    createdAt: new Date()
  });
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'workout' | 'food' | 'insights' | 'profile'>('home');
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [balance, setBalance] = useState<CalorieBalance>({ burned: 0, intake: 0, net: 0 });

  useEffect(() => {
    if (!user) return;

    // Listen to workouts
    const wUnsubscribe = onSnapshot(
      query(collection(db, 'workouts'), where('userId', '==', user.uid), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ 
          id: d.id, 
          ...d.data(),
          timestamp: (d.data().timestamp as Timestamp).toDate() 
        })) as Workout[];
        setWorkouts(data);
      },
      (err) => console.error('Workouts fetch error:', err)
    );

    // Listen to foods
    const fUnsubscribe = onSnapshot(
      query(collection(db, 'foods'), where('userId', '==', user.uid), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ 
          id: d.id, 
          ...d.data(),
          timestamp: (d.data().timestamp as Timestamp).toDate()
        })) as FoodEntry[];
        setFoods(data);
      },
      (err) => console.error('Foods fetch error:', err)
    );

    return () => {
      wUnsubscribe();
      fUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysWorkouts = workouts.filter(w => w.timestamp >= today);
    const todaysFoods = foods.filter(f => f.timestamp >= today);

    const burned = todaysWorkouts.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
    const intake = todaysFoods.reduce((acc, curr) => acc + curr.calories, 0);
    
    setBalance({
      burned,
      intake,
      net: burned - intake
    });
  }, [workouts, foods]);

  const saveWorkout = async (workout: Workout) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'workouts'), {
        ...workout,
        userId: user.uid,
        timestamp: Timestamp.fromDate(new Date())
      });
      setActiveTab('home');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'workouts');
    }
  };

  const saveFood = async (food: FoodEntry) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'foods'), {
        ...food,
        userId: user.uid,
        timestamp: Timestamp.fromDate(new Date())
      });
      setActiveTab('home');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'foods');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      <main className="max-w-md mx-auto px-6 pt-12 pb-40 relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'home' && <Home balance={balance} workouts={workouts} foods={foods} user={user} />}
            {activeTab === 'workout' && <WorkoutLogger onSave={saveWorkout} weight={user.weight} />}
            {activeTab === 'food' && <FoodScanner onSave={saveFood} />}
            {activeTab === 'insights' && <Insights user={user} workouts={workouts} foods={foods} />}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <header>
                  <h1 className="text-3xl font-black text-white">Profile</h1>
                  <p className="text-white/60">Manage your body stats.</p>
                </header>
                <GlassCard className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                       <UserIcon className="w-8 h-8 text-blue-400" />
                     </div>
                     <div>
                       <h2 className="text-xl font-black text-white">{user.displayName}</h2>
                       <p className="text-white/40 text-sm">{user.email}</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Weight</label>
                      <span className="text-2xl font-black text-white">{user.weight} kg</span>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Goal</label>
                      <span className="text-2xl font-black text-blue-400 uppercase leading-tight">{user.goal.replace('_', ' ')}</span>
                    </div>
                  </div>
                </GlassCard>
                <div className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] py-8">
                  AI Fitness Pro v1.0.0
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function UserIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
