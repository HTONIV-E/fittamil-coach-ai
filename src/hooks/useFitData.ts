import { useLocalStorage } from './useLocalStorage';
import { UserProfile, AIPlan, DailyData, Measurement, ProfileMeta } from '@/types/fitness';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY_PREFIX = 'ftai_v3';
const META_KEY = 'ftai_v3_meta';

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

interface MetaState {
  profiles: ProfileMeta[];
  activeProfileId: number | null;
}

const defaultState: StoredState = {
  profile: null, plan: null, daily: defaultDaily,
  streak: 0, bestStreak: 0, lastDate: '', workoutStreak: 0,
  measurements: [], bmiHistory: [],
  theme: 'dark', language: 'en', onboarded: false,
  activeProfile: 0, glassSize: 250, stepGoal: 8000,
  weekMeals: {}, workoutHistory: {},
};

const defaultMeta: MetaState = {
  profiles: [],
  activeProfileId: null,
};

function getStorageKey(profileId: number): string {
  return `${STORAGE_KEY_PREFIX}_profile_${profileId}`;
}

export function useFitData() {
  const [meta, setMeta] = useLocalStorage<MetaState>(META_KEY, defaultMeta);
  
  // Migrate: if old ftai_v3 key exists and no profiles, migrate it
  useEffect(() => {
    if (meta.profiles.length === 0) {
      try {
        const old = window.localStorage.getItem('ftai_v3');
        if (old) {
          const oldState = JSON.parse(old) as StoredState;
          if (oldState.onboarded && oldState.profile) {
            const profileMeta: ProfileMeta = {
              id: 0,
              name: oldState.profile.name || 'Profile 1',
              emoji: oldState.profile.gender === 'female' ? '👩' : oldState.profile.gender === 'male' ? '👨' : '🧑',
              createdAt: new Date().toISOString(),
            };
            window.localStorage.setItem(getStorageKey(0), old);
            setMeta({ profiles: [profileMeta], activeProfileId: 0 });
            return;
          }
        }
      } catch { /* ignore */ }
    }
  }, []);

  const activeId = meta.activeProfileId;
  const storageKey = activeId !== null ? getStorageKey(activeId) : `${STORAGE_KEY_PREFIX}_temp`;
  
  const [state, setState] = useLocalStorage<StoredState>(storageKey, defaultState);

  const today = new Date().toISOString().split('T')[0];

  // Daily reset — streak threshold changed to >= 6
  useEffect(() => {
    if (state.lastDate && state.lastDate !== today) {
      const mealsChecked = Object.values(state.daily.meals).filter(Boolean).length;
      const streakContinues = mealsChecked >= 6;
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

  // Multi-profile methods
  const addProfile = useCallback((name: string, emoji: string) => {
    const newId = meta.profiles.length > 0 ? Math.max(...meta.profiles.map(p => p.id)) + 1 : 0;
    const newProfile: ProfileMeta = { id: newId, name, emoji, createdAt: new Date().toISOString() };
    window.localStorage.setItem(getStorageKey(newId), JSON.stringify(defaultState));
    setMeta(prev => ({ profiles: [...prev.profiles, newProfile], activeProfileId: newId }));
  }, [meta.profiles, setMeta]);

  const switchProfile = useCallback((id: number) => {
    setMeta(prev => ({ ...prev, activeProfileId: id }));
  }, [setMeta]);

  const deleteProfile = useCallback((id: number) => {
    window.localStorage.removeItem(getStorageKey(id));
    setMeta(prev => {
      const remaining = prev.profiles.filter(p => p.id !== id);
      return { profiles: remaining, activeProfileId: null };
    });
  }, [setMeta]);

  const editProfile = useCallback((id: number, name: string, emoji: string) => {
    setMeta(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === id ? { ...p, name, emoji } : p),
    }));
  }, [setMeta]);

  const goToProfilePicker = useCallback(() => {
    setMeta(prev => ({ ...prev, activeProfileId: null }));
  }, [setMeta]);

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
    // Multi-profile
    profiles: meta.profiles,
    activeProfileId: meta.activeProfileId,
    addProfile, switchProfile, deleteProfile, editProfile, goToProfilePicker,
  };
}
