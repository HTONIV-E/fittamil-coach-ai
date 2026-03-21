import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a Tamil Nadu fitness & nutrition expert AI. Generate a COMPLETE personalized fitness plan based on the user profile. You MUST return valid JSON matching the exact schema below. Be creative and personalize everything based on the user's specific inputs - diet type, region, conditions, goals, favourite foods, occupation, activity level etc.

CRITICAL: Every plan must be UNIQUE to the user. Different users with different profiles MUST get different meals, different workouts, different tips. Use the user's favourite foods, region, conditions, and preferences to customize everything.

Return this JSON structure:
{
  "bmr": number (Mifflin-St Jeor: Male=10*weight+6.25*height-5*age+5, Female=10*weight+6.25*height-5*age-161),
  "tdee": number (BMR * activity multiplier: sedentary=1.375, light=1.55, moderate=1.725, active=1.9),
  "dailyCalories": number (TDEE-500 for loss, TDEE+300 for muscle, TDEE for wellness),
  "dailyWater": number (weight * 0.033 * 1000 in ml),
  "stepGoal": number (6000-12000 based on activity),
  "currentBMI": number,
  "targetBMI": number,
  "idealWeightRange": [number, number],
  "weeksToGoal": number,
  "meals": [7 meals with {id: "meal-0" to "meal-6", name, time (like "6:30 AM"), calories, foods (specific Tamil foods based on diet type and region and user preferences), done: false}],
  "workoutSchedule": {"Monday":[{id,name,sets,done:false}],...for all 7 days} - personalized based on gym access, goal, conditions, workout duration,
  "coreExercises": [{id: "core-0" etc, name, sets, done: false}] - 5 exercises,
  "weeklyMealPlan": {"Monday":[same meal structure],...} - VARIED meals each day, not copy-paste,
  "doEat": [8 items specific to user's diet type and region],
  "avoidEat": [6 items specific to user's conditions and goals],
  "foodSwaps": [{from, to, saved: number}] - 4 swaps relevant to user,
  "dailyHabits": {morning: [3], preworkout: [2], postworkout: [2], night: [3]},
  "milestones": [{week: 4, goal, done: false}, {week: 8, goal, done: false}, {week: 12, goal, done: false}],
  "coachNotes": {strategy: string, tips: [4 strings], warnings: [based on conditions], quote: "Tamil quote — English translation"},
  "reminderTimes": [7 time strings based on wake/sleep time],
  "generatedAt": "ISO date string"
}

For vegetarian users, NEVER include meat/fish. For vegan, no dairy/eggs either. For eggetarian, include eggs but no meat.
For users with knee pain, avoid high-impact exercises. For back pain, avoid heavy deadlifts.
For Chennai users, include local foods. For Madurai/Coimbatore, include regional specialties.
Match workout intensity to activity level and duration preference.`;

    const userPrompt = `Generate a complete personalized fitness plan for this user:
Name: ${profile.name}
Age: ${profile.age}, Gender: ${profile.gender}
Weight: ${profile.weight}kg, Target: ${profile.targetWeight}kg, Height: ${profile.height}cm
Conditions: ${profile.conditions?.join(', ') || 'None'}
Sleep: ${profile.sleepHours}, Stress: ${profile.stressLevel}
Activity: ${profile.activityLevel}, Goal: ${profile.fitnessGoal}
Gym: ${profile.gymAccess}, Workout: ${profile.workoutDays}x/week, ${profile.workoutDuration}min, Time: ${profile.workoutTime}
Diet: ${profile.dietType}, Favourite foods: ${profile.favFoods || 'Not specified'}
Water: ${profile.waterIntake} glasses, Rice at night: ${profile.riceAtNight}, Coffee: ${profile.coffeeCups}/day
Wake: ${profile.wakeTime}, Sleep: ${profile.sleepTime}
Occupation: ${profile.occupation}, Region: ${profile.region}
Motivation: ${profile.motivation}, Commitment: ${profile.commitment}/10
Family support: ${profile.familySupport}

Return ONLY the JSON object, no markdown, no explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const plan = JSON.parse(content);
    plan.generatedAt = new Date().toISOString();

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
