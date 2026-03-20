import { useState, useCallback } from 'react';
import { useFitData } from '@/hooks/useFitData';
import { generatePlan } from '@/hooks/usePlanGenerator';
import { Onboarding } from '@/components/Onboarding';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Dashboard } from '@/components/pages/Dashboard';
import { TodaysMeals } from '@/components/pages/TodaysMeals';
import { TodaysWorkout } from '@/components/pages/TodaysWorkout';
import { WaterFasting } from '@/components/pages/WaterFasting';
import { CalorieCounter } from '@/components/pages/CalorieCounter';
import { BMICalculator } from '@/components/pages/BMICalculator';
import { AICoach } from '@/components/pages/AICoach';
import { ProfilePage } from '@/components/pages/ProfilePage';
import { MyPlan } from '@/components/pages/MyPlan';
import { UserProfile, AIPlan } from '@/types/fitness';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard', myplan: 'My Plan', meals: "Today's Meals",
  mealplanner: 'Meal Planner', calories: 'Calorie Counter', recipes: 'Recipes',
  workout: "Today's Workout", challenges: 'Challenges', water: 'Water & Fasting',
  tips: 'Tips & Breathing', coach: 'AI Coach', profile: 'Profile',
  progress: 'Progress', bmi: 'BMI Calculator',
};

const Index = () => {
  const data = useFitData();
  const [page, setPage] = useState('dashboard');

  const handleOnboardingComplete = useCallback((profile: UserProfile, plan: AIPlan) => {
    data.setProfile(profile);
    data.setPlan(plan);
    toast.success('Your personalised plan is ready! 🎉');
  }, [data]);

  if (!data.onboarded || !data.profile || !data.plan) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const { profile, plan, daily } = data;

  const handleToggleMeal = (id: string) => {
    data.updateDaily(d => ({ ...d, meals: { ...d.meals, [id]: !d.meals[id] } }));
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const handleToggleHabit = (habit: string) => {
    data.updateDaily(d => ({
      ...d,
      habitsDone: d.habitsDone.includes(habit)
        ? d.habitsDone.filter(h => h !== habit)
        : [...d.habitsDone, habit],
    }));
  };

  const handleToggleExercise = (id: string) => {
    data.updateDaily(d => ({ ...d, workout: { ...d.workout, [id]: !d.workout[id] } }));
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const handleToggleCore = (id: string) => {
    data.updateDaily(d => ({ ...d, coreWorkout: { ...d.coreWorkout, [id]: !d.coreWorkout[id] } }));
  };

  const handleAddWater = () => {
    data.updateDaily(d => ({ ...d, water: d.water + 1 }));
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleRemoveWater = () => {
    data.updateDaily(d => ({ ...d, water: Math.max(0, d.water - 1) }));
  };

  const handleToggleAmla = (period: 'morning' | 'noon' | 'evening') => {
    data.updateDaily(d => ({ ...d, amla: { ...d.amla, [period]: !d.amla[period] } }));
  };

  const handleAddFood = (name: string, calories: number) => {
    data.updateDaily(d => ({ ...d, foodLog: [...d.foodLog, { name, calories }] }));
    toast.success(`Added ${name}`);
  };

  const handleRemoveFood = (index: number) => {
    data.updateDaily(d => ({ ...d, foodLog: d.foodLog.filter((_, i) => i !== index) }));
  };

  const handleRegenerate = () => {
    const newPlan = generatePlan(profile);
    data.setPlan(newPlan);
    toast.success('Plan regenerated! 🤖');
  };

  const profileSummary = `${profile.name}, ${profile.age}yo ${profile.gender}, ${profile.weight}kg targeting ${profile.targetWeight}kg, ${profile.fitnessGoal} goal, ${profile.dietType} diet`;
  const dailySummary = `Today: ${Object.values(daily.meals).filter(Boolean).length} meals, ${daily.water} glasses water, ${Object.values(daily.workout).filter(Boolean).length} exercises`;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard plan={plan} daily={daily} streak={data.streak} profile={profile}
          onNavigate={setPage} onLogWeight={() => setPage('profile')} />;
      case 'myplan':
        return <MyPlan plan={plan} onRegenerate={handleRegenerate} />;
      case 'meals':
        return <TodaysMeals plan={plan} daily={daily} onToggleMeal={handleToggleMeal} onToggleHabit={handleToggleHabit} />;
      case 'workout':
        return <TodaysWorkout plan={plan} daily={daily} onToggleExercise={handleToggleExercise} onToggleCore={handleToggleCore} />;
      case 'water':
        return <WaterFasting plan={plan} daily={daily} glassSize={data.glassSize} onAddWater={handleAddWater} onRemoveWater={handleRemoveWater} onToggleAmla={handleToggleAmla} />;
      case 'calories':
        return <CalorieCounter plan={plan} daily={daily} onAddFood={handleAddFood} onRemoveFood={handleRemoveFood} />;
      case 'bmi':
        return <BMICalculator profile={profile} onSaveBMI={data.addBMI} bmiHistory={data.bmiHistory} />;
      case 'coach':
        return <AICoach profileSummary={profileSummary} dailySummary={dailySummary} />;
      case 'profile':
        return <ProfilePage profile={profile} onUpdateProfile={data.updateProfile}
          theme={data.theme} onSetTheme={data.setTheme} onRegeneratePlan={handleRegenerate}
          daily={{ mood: daily.mood, energy: daily.energy }}
          onUpdateDaily={(mood, energy) => data.updateDaily(d => ({ ...d, mood, energy }))} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <span className="text-5xl">🚧</span>
            <h3 className="font-heading text-2xl">{PAGE_TITLES[page] || page}</h3>
            <p className="text-sm text-muted-foreground">Coming soon!</p>
            <button onClick={() => setPage('dashboard')} className="text-ft-cyan text-sm underline">← Back to Dashboard</button>
          </div>
        );
    }
  };

  return (
    <MobileLayout title={PAGE_TITLES[page] || 'FitTamil AI'} streak={data.streak}
      profile={profile} onNavigate={setPage} currentPage={page}>
      {renderPage()}
    </MobileLayout>
  );
};

export default Index;
