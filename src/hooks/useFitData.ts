import { useLocalStorage } from './useLocalStorage';
import { UserProfile, AIPlan, DailyData, Measurement } from '@/types/fitness';
import { useCallback, useEffect } from 'react';

const STORAGE_KEY = 'ftai_v3';

const defaultDaily: DailyData = {
  meals: {}, workout: {}, coreWorkout: {}, water: 0,
  amla: { morning: false, noon: false, evening: false },
  steps: 0, mood: '', energy: 5, foodLog: [], habitsDone: [],
};

interface StoredState {
  profile: UserProfile | null;
  plan: AIPlan | null;
  daily: DailyData;
  streak: number;
  bestStreak: number;
  lastDate: string;
  workoutStreak: number;
  measurements: Measurement[];
  bmiHistory: { date: string; bmi: number }[];
  theme: 'dark' | 'light' | 'auto';
  language: 'en' | 'ta';
  onboarded: boolean;
  activeProfile: number;
  glassSize: number;
  stepGoal: number;
  weekMeals: Record<string, number>;
  workoutHistory: Record<string, string[]>;
}

const defaultState: StoredState = {
  profile: null, plan: null, daily: defaultDaily,
  streak: 0, bestStreak: 0, lastDate: '', workoutStreak: 0,
  measurements: [], bmiHistory: [],
  theme: 'dark', language: 'en', onboarded: false,
  activeProfile: 0, glassSize: 250, stepGoal: 8000,
  weekMeals: {}, workoutHistory: {},
};

export function useFitData() {
  const [state, setState] = useLocalStorage<StoredState>(STORAGE_KEY, defaultState);

  const today = new Date().toISOString().split('T')[0];

  // Daily reset
  useEffect(() => {
    if (state.lastDate && state.lastDate !== today) {
      const mealsChecked = Object.values(state.daily.meals).filter(Boolean).length;
      const streakContinues = mealsChecked >= 4;
      const newStreak = streakContinues ? state.streak + 1 : 0;
      const workoutDone = Object.values(state.daily.workout).filter(Boolean).length > 0;

      setState(prev => ({
        ...prev,
        daily: defaultDaily,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        workoutStreak: workoutDone ? prev.workoutStreak + 1 : 0,
        lastDate: today,
        weekMeals: { ...prev.weekMeals, [prev.lastDate]: mealsChecked },
        workoutHistory: {
          ...prev.workoutHistory,
          [prev.lastDate]: Object.entries(prev.daily.workout)
            .filter(([, v]) => v).map(([k]) => k),
        },
      }));
    } else if (!state.lastDate) {
      setState(prev => ({ ...prev, lastDate: today }));
    }
  }, [today, state.lastDate]);

  const setProfile = useCallback((p: UserProfile) =>
    setState(prev => ({ ...prev, profile: p, onboarded: true })), [setState]);

  const setPlan = useCallback((p: AIPlan) =>
    setState(prev => ({ ...prev, plan: p })), [setState]);

  const updateDaily = useCallback((fn: (d: DailyData) => DailyData) =>
    setState(prev => ({ ...prev, daily: fn(prev.daily) })), [setState]);

  const addMeasurement = useCallback((m: Measurement) =>
    setState(prev => ({ ...prev, measurements: [...prev.measurements, m] })), [setState]);

  const addBMI = useCallback((bmi: number) =>
    setState(prev => ({
      ...prev,
      bmiHistory: [...prev.bmiHistory, { date: today, bmi }],
    })), [setState, today]);

  const setTheme = useCallback((t: 'dark' | 'light' | 'auto') =>
    setState(prev => ({ ...prev, theme: t })), [setState]);

  const setLanguage = useCallback((l: 'en' | 'ta') =>
    setState(prev => ({ ...prev, language: l })), [setState]);

  const updateProfile = useCallback((partial: Partial<UserProfile>) =>
    setState(prev => prev.profile ? { ...prev, profile: { ...prev.profile, ...partial } } : prev), [setState]);

  const resetAll = useCallback(() => setState(defaultState), [setState]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (state.theme === 'auto') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!dark) root.classList.add('light');
    } else if (state.theme === 'light') {
      root.classList.add('light');
    }
  }, [state.theme]);

  return {
    ...state, today, setProfile, setPlan, updateDaily,
    addMeasurement, addBMI, setTheme, setLanguage,
    updateProfile, resetAll, setState,
  };
}
