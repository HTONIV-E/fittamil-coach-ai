export interface ProfileMeta {
  id: number;
  name: string;
  emoji: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  targetWeight: number;
  height: number;
  conditions: string[];
  sleepHours: string;
  stressLevel: string;
  activityLevel: string;
  fitnessGoal: string;
  gymAccess: string;
  workoutDays: number;
  workoutDuration: number;
  workoutTime: string;
  dietType: string;
  favFoods: string;
  waterIntake: number;
  riceAtNight: string;
  coffeeCups: string;
  wakeTime: string;
  sleepTime: string;
  occupation: string;
  region: string;
  motivation: string;
  commitment: number;
  familySupport: string;
  language: 'en' | 'ta';
  // New fields
  jobType: string;
  commuteType: string;
  bodyType: string;
  injuries: string;
  onMedication: boolean;
  targetTimeline: string;
  triedBefore: string;
  cuisinePreference: string;
  mealsPerDay: number;
  skipBreakfast: boolean;
  equipment: string[];
  menstrualRegularity: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  foods: string;
  done: boolean;
  doneAt?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: string;
  done: boolean;
}

export interface AIPlan {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  dailyWater: number;
  stepGoal: number;
  currentBMI: number;
  targetBMI: number;
  idealWeightRange: [number, number];
  weeksToGoal: number;
  meals: Meal[];
  workoutSchedule: Record<string, WorkoutExercise[]>;
  coreExercises: WorkoutExercise[];
  weeklyMealPlan: Record<string, Meal[]>;
  doEat: string[];
  avoidEat: string[];
  foodSwaps: { from: string; to: string; saved: number }[];
  dailyHabits: { morning: string[]; preworkout: string[]; postworkout: string[]; night: string[] };
  milestones: { week: number; goal: string; done: boolean }[];
  coachNotes: { strategy: string; tips: string[]; warnings: string[]; quote: string };
  reminderTimes: string[];
  generatedAt: string;
}

export interface DailyData {
  meals: Record<string, boolean>;
  workout: Record<string, boolean>;
  coreWorkout: Record<string, boolean>;
  water: number;
  amla: { morning: boolean; noon: boolean; evening: boolean };
  steps: number;
  mood: string;
  energy: number;
  foodLog: { name: string; calories: number }[];
  habitsDone: string[];
  customMeals?: Meal[];
  mealEdits?: Record<string, Partial<Meal>>;
}

export interface Measurement {
  date: string;
  type: string;
  value: number;
}

export interface AppState {
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
}

export const TAMIL_FOODS = [
  { name: 'Idli', calories: 39 }, { name: 'Dosa', calories: 120 },
  { name: 'Pongal', calories: 220 }, { name: 'Upma', calories: 180 },
  { name: 'Ragi Dosai', calories: 95 }, { name: 'Pesarattu', calories: 110 },
  { name: 'Plain Rice', calories: 206 }, { name: 'Red Rice', calories: 185 },
  { name: 'Sambar', calories: 95 }, { name: 'Rasam', calories: 35 },
  { name: 'Pepper Rasam', calories: 35 }, { name: 'Dal', calories: 150 },
  { name: 'Fish Kuzhambu', calories: 180 }, { name: 'Chicken Curry', calories: 230 },
  { name: 'Egg Curry', calories: 120 }, { name: 'Poriyal', calories: 95 },
  { name: 'Chapati', calories: 71 }, { name: 'Keerai Masiyal', calories: 120 },
  { name: 'Boiled Egg', calories: 78 }, { name: 'Banana', calories: 89 },
  { name: 'Peanuts', calories: 170 }, { name: 'Sundal', calories: 130 },
  { name: 'Buttermilk', calories: 35 }, { name: 'Amla Water', calories: 12 },
  { name: 'Filter Coffee', calories: 35 }, { name: 'Green Tea', calories: 2 },
  { name: 'Turmeric Milk', calories: 120 }, { name: 'Coconut Water', calories: 46 },
] as const;

export const TAMIL_QUOTES = [
  { ta: 'நலமே வாழ்க்கை', en: 'Health is life' },
  { ta: 'முயற்சி திருவினை ஆக்கும்', en: 'Effort turns fortune into reality' },
  { ta: 'ஆரோக்கியமே ஆனந்தம்', en: 'Health is happiness' },
  { ta: 'விடாமுயற்சி வெற்றி தரும்', en: 'Perseverance brings victory' },
  { ta: 'உடல் நலமே உயர்ந்த செல்வம்', en: 'Health is the greatest wealth' },
  { ta: 'தினமும் ஒரு அடி முன்னேறு', en: 'Move one step forward every day' },
  { ta: 'மனம் உறுதியாக இருந்தால் உடல் பின்தொடரும்', en: 'When mind is strong body follows' },
] as const;

export const TAMIL_FESTIVALS = [
  { name: 'Thai Pongal', date: '01-14', tip: 'Enjoy pongal in moderation — stick to one serving' },
  { name: 'Mattu Pongal', date: '01-15', tip: 'Stay active with family outdoor games today' },
  { name: 'Tamil New Year', date: '04-14', tip: 'Start the new year with healthy resolutions' },
  { name: 'Adiperukku', date: '08-03', tip: 'Choose steamed over fried festival snacks' },
  { name: 'Vinayagar Chaturthi', date: '09-07', tip: 'Make sundal your go-to festival snack' },
  { name: 'Navratri', date: '10-03', tip: 'Fasting? Keep hydrated with buttermilk and coconut water' },
  { name: 'Deepavali', date: '11-01', tip: 'Balance sweets with extra workout today' },
  { name: 'Karthigai Deepam', date: '11-27', tip: 'Oil baths are great — add a walk too' },
  { name: 'Thiruvadhirai', date: '12-22', tip: 'Kali is nutritious — enjoy without guilt' },
] as const;
