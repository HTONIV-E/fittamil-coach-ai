import { UserProfile, AIPlan, Meal, WorkoutExercise } from '@/types/fitness';

function calcBMR(p: UserProfile): number {
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return p.gender === 'female' ? base - 161 : base + 5;
}

function activityMultiplier(level: string): number {
  switch (level) {
    case 'sedentary': return 1.375;
    case 'light': return 1.55;
    case 'moderate': return 1.725;
    case 'active': return 1.9;
    default: return 1.55;
  }
}

function calcBMI(weight: number, height: number): number {
  return +(weight / ((height / 100) ** 2)).toFixed(1);
}

function generateMeals(p: UserProfile, calories: number): Meal[] {
  const isVeg = p.dietType === 'veg' || p.dietType === 'vegan';
  const noEgg = p.dietType === 'vegan';
  const perMeal = Math.round(calories / 7);

  const mealTemplates = [
    { time: '6:30 AM', name: 'Morning Drink', foods: 'Amla water + soaked almonds', cal: 50 },
    { time: '8:00 AM', name: 'Breakfast', foods: isVeg ? 'Ragi Dosai + Sambar + Coconut Chutney' : 'Egg Dosa + Sambar', cal: Math.round(perMeal * 1.3) },
    { time: '10:30 AM', name: 'Mid-Morning', foods: 'Banana + Peanuts + Green Tea', cal: Math.round(perMeal * 0.7) },
    { time: '1:00 PM', name: 'Lunch', foods: isVeg ? 'Red Rice + Sambar + Poriyal + Rasam + Buttermilk' : 'Red Rice + Fish Kuzhambu + Poriyal + Rasam', cal: Math.round(perMeal * 1.5) },
    { time: '4:00 PM', name: 'Evening Snack', foods: 'Sundal + Filter Coffee', cal: Math.round(perMeal * 0.6) },
    { time: '7:00 PM', name: 'Dinner', foods: p.riceAtNight === 'no' ? 'Chapati + Dal + Keerai Masiyal' : 'Red Rice + Sambar + Poriyal', cal: Math.round(perMeal * 1.2) },
    { time: '9:00 PM', name: 'Night Drink', foods: 'Turmeric Milk', cal: 120 },
  ];

  return mealTemplates.map((m, i) => ({
    id: `meal-${i}`, name: m.name, time: m.time,
    calories: m.cal, foods: m.foods, done: false,
  }));
}

function generateWorkouts(p: UserProfile): Record<string, WorkoutExercise[]> {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const schedule: Record<string, WorkoutExercise[]> = {};
  const hasGym = p.gymAccess === 'yes';
  const isLoss = p.fitnessGoal === 'loss';

  const exercises = {
    cardio: [
      { name: 'Brisk Walking', sets: '20 min' },
      { name: 'Jumping Jacks', sets: '3×20' },
      { name: 'High Knees', sets: '3×30s' },
      { name: 'Burpees', sets: '3×10' },
    ],
    strength: hasGym ? [
      { name: 'Squats', sets: '3×12' },
      { name: 'Bench Press', sets: '3×10' },
      { name: 'Deadlift', sets: '3×8' },
      { name: 'Shoulder Press', sets: '3×10' },
      { name: 'Rows', sets: '3×12' },
    ] : [
      { name: 'Push-ups', sets: '3×15' },
      { name: 'Bodyweight Squats', sets: '3×20' },
      { name: 'Lunges', sets: '3×12 each' },
      { name: 'Plank', sets: '3×45s' },
      { name: 'Tricep Dips', sets: '3×12' },
    ],
    rest: [{ name: 'Rest Day — Light stretching', sets: '15 min' }],
  };

  for (let i = 0; i < 7; i++) {
    if (i >= p.workoutDays) {
      schedule[days[i]] = exercises.rest.map((e, j) => ({ ...e, id: `${days[i]}-${j}`, done: false }));
    } else {
      const dayExercises = i % 2 === 0 ? exercises.cardio : exercises.strength;
      schedule[days[i]] = dayExercises.map((e, j) => ({ ...e, id: `${days[i]}-${j}`, done: false }));
    }
  }
  return schedule;
}

export function generatePlan(profile: UserProfile): AIPlan {
  const bmr = calcBMR(profile);
  const tdee = Math.round(bmr * activityMultiplier(profile.activityLevel));
  const calorieTarget = profile.fitnessGoal === 'loss'
    ? tdee - 500
    : profile.fitnessGoal === 'muscle' ? tdee + 300 : tdee;
  const currentBMI = calcBMI(profile.weight, profile.height);
  const targetBMI = calcBMI(profile.targetWeight, profile.height);
  const waterMl = Math.round(profile.weight * 0.033 * 1000);
  const weekDiff = Math.abs(profile.weight - profile.targetWeight);
  const weeksToGoal = Math.max(4, Math.round(weekDiff / 0.5));
  const idealLow = Math.round(18.5 * (profile.height / 100) ** 2);
  const idealHigh = Math.round(24.9 * (profile.height / 100) ** 2);

  const meals = generateMeals(profile, calorieTarget);
  const workoutSchedule = generateWorkouts(profile);

  // Generate weekly meal plan (same structure, slight variations)
  const weeklyMealPlan: Record<string, Meal[]> = {};
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
    weeklyMealPlan[day] = meals.map(m => ({ ...m, id: `${day}-${m.id}` }));
  });

  return {
    bmr, tdee, dailyCalories: calorieTarget, dailyWater: waterMl,
    stepGoal: 8000, currentBMI, targetBMI,
    idealWeightRange: [idealLow, idealHigh], weeksToGoal,
    meals,
    workoutSchedule,
    coreExercises: [
      { id: 'core-0', name: 'Crunches', sets: '3×20', done: false },
      { id: 'core-1', name: 'Bicycle Crunches', sets: '3×15', done: false },
      { id: 'core-2', name: 'Plank', sets: '3×45s', done: false },
      { id: 'core-3', name: 'Mountain Climbers', sets: '3×20', done: false },
      { id: 'core-4', name: 'Leg Raises', sets: '3×15', done: false },
    ],
    weeklyMealPlan,
    doEat: [
      'Ragi, millets, red rice', 'Sambar, rasam daily', 'Seasonal vegetables & greens',
      'Buttermilk after meals', 'Amla water morning', 'Peanuts & sundal for snacks',
      'Filter coffee (max 2/day)', 'Coconut in moderation',
    ],
    avoidEat: [
      'Refined sugar & sweets', 'Deep fried snacks', 'White rice at dinner',
      'Packaged juice & soda', 'Maida-based foods', 'Excessive oil in cooking',
    ],
    foodSwaps: [
      { from: 'White Rice', to: 'Red Rice / Millets', saved: 40 },
      { from: 'Fried Snacks', to: 'Sundal / Peanuts', saved: 150 },
      { from: 'Soft Drinks', to: 'Buttermilk / Coconut Water', saved: 120 },
      { from: 'Sweets', to: 'Fresh Fruits', saved: 200 },
    ],
    dailyHabits: {
      morning: ['Amla water on empty stomach', 'Stretching for 5 min', '10 min walk'],
      preworkout: ['Banana + water', 'Light warm-up'],
      postworkout: ['Protein-rich snack', 'Hydrate well'],
      night: ['Turmeric milk', 'No screen 30 min before bed', 'Gratitude journaling'],
    },
    milestones: [
      { week: 4, goal: `Lose ${Math.min(2, weekDiff)}kg, build workout habit`, done: false },
      { week: 8, goal: `Reach ${Math.max(profile.targetWeight, profile.weight - 4)}kg, improve stamina`, done: false },
      { week: 12, goal: `Reach ${profile.targetWeight}kg target weight`, done: false },
    ],
    coachNotes: {
      strategy: profile.fitnessGoal === 'loss'
        ? 'Calorie deficit of 500kcal/day with balanced Tamil meals. Focus on portion control and replacing white rice with millets.'
        : 'Progressive overload with adequate protein. Tamil diet supplemented with eggs and paneer for muscle building.',
      tips: [
        'Start each day with amla water — boosts metabolism',
        'Walk 10 minutes after every main meal',
        'Sleep by 10 PM for optimal fat burning',
        'Buttermilk with lunch aids digestion',
      ],
      warnings: profile.conditions.filter(c => c !== 'none').map(c =>
        `Be cautious with ${c} — modify exercises accordingly`
      ),
      quote: 'முயற்சி திருவினை ஆக்கும் — Effort turns fortune into reality',
    },
    reminderTimes: [
      profile.wakeTime || '6:00',
      '8:00', '10:30', '13:00', '16:00', '19:00',
      profile.sleepTime || '22:00',
    ],
    generatedAt: new Date().toISOString(),
  };
}
