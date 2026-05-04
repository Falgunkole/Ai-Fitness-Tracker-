export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  weight: number;
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  createdAt: Date;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface Workout {
  id?: string;
  userId: string;
  exercise: string;
  variation: string;
  sets: WorkoutSet[];
  caloriesBurned: number;
  timestamp: Date;
}

export interface FoodEntry {
  id?: string;
  userId: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  imageUrl?: string;
  timestamp: Date;
}

export interface Insight {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'recovery' | 'nutrition' | 'consistency';
  timestamp: Date;
}

export interface CalorieBalance {
  burned: number;
  intake: number;
  net: number;
}
