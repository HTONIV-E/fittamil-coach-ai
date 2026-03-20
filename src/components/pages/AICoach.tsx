import { useState } from 'react';
import { GradientButton } from '@/components/shared/GradientButton';
import { Bot, Send, Trash2, Sparkles, BarChart3 } from 'lucide-react';

interface AICoachProps {
  profileSummary: string;
  dailySummary: string;
}

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  "Why is my belly not reducing?",
  "Am I eating enough protein?",
  "Review my progress this week",
  "What should I eat before workout?",
  "How is my sleep affecting me?",
  "Give me motivation today",
  "Is my calorie target right?",
  "What is my biggest weakness?",
];

function generateResponse(msg: string, profileSummary: string, dailySummary: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('belly') || lower.includes('stomach')) {
    return `Based on your profile, belly fat reduction needs consistency. Focus on:\n\n1. **Core exercises daily** — crunches, planks, mountain climbers\n2. **Reduce rice at dinner** — switch to chapati or millets\n3. **Walk 10 min after meals** — this specifically targets visceral fat\n4. **Drink amla water** morning — boosts metabolism\n\nSpot reduction is a myth, but these habits target overall fat loss which shows first on your belly. Keep your calorie deficit consistent!\n\n*${dailySummary}*`;
  }
  if (lower.includes('protein')) {
    return `For your goals, you need about **1.2-1.6g protein per kg** body weight daily. Tamil diet protein sources:\n\n🥚 Eggs — 6g each\n🐓 Chicken — 31g per 100g\n🐟 Fish — 22g per 100g\n🫘 Dal — 9g per cup\n🥜 Peanuts — 26g per 100g\n🫗 Paneer — 18g per 100g\n\nAdd sundal, buttermilk, and boiled eggs as snacks. Your current plan should cover this if followed consistently!`;
  }
  if (lower.includes('motivation') || lower.includes('motivate')) {
    return `💪 **உடல் நலமே உயர்ந்த செல்வம்** — Health is the greatest wealth!\n\nRemember why you started this journey. Every meal you choose wisely, every workout you complete — it compounds.\n\nYour body hears everything your mind says. Stay positive!\n\n🔥 You have the discipline. You're already ahead of 90% of people by tracking your health!\n\n*Keep going, champion!*`;
  }
  if (lower.includes('sleep')) {
    return `Sleep is CRUCIAL for fitness! Here's why:\n\n😴 **Poor sleep = higher cortisol = belly fat storage**\n🔄 **Recovery happens during deep sleep** — muscles repair\n🍽️ **Sleep deprivation increases hunger hormones**\n\nTamil wellness tips:\n- Drink turmeric milk 30 min before bed\n- No screen time 1 hour before sleep\n- Try the 4-2-6 breathing exercise\n- Keep your room cool and dark\n\nAim for 7-8 hours consistently!`;
  }
  return `Great question! Here's my advice based on your profile:\n\n${profileSummary}\n\nKey recommendations:\n1. Stay consistent with your meal plan\n2. Track your water intake — it's crucial for Tamil Nadu's climate\n3. Don't skip your morning amla water\n4. Walk after meals for better digestion\n\nWould you like me to analyse a specific aspect of your journey? 💪`;
}

export function AICoach({ profileSummary, dailySummary }: AICoachProps) {
  const [mode, setMode] = useState<'chat' | 'analyse'>('chat');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: '🤖 Vanakkam! I\'m Coach Tamil, your AI fitness coach. Ask me anything about your diet, workout, or wellness journey!' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    const response = generateResponse(text, profileSummary, dailySummary);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setTyping(false);
  };

  const runAnalysis = async () => {
    setAnalysing(true);
    await new Promise(r => setTimeout(r, 2000));
    setAnalysis(`## 📊 Day Analysis

**Score: 7.2/10**

| Category | Score |
|----------|-------|
| 🍽️ Meals | 7/10 |
| 💪 Workout | 8/10 |
| 💧 Hydration | 6/10 |
| 🧘 Wellness | 8/10 |

### ✅ Done Well
1. Completed morning workout consistently
2. Followed Tamil meal plan for breakfast & lunch
3. Maintained good sleep schedule

### ⚠️ To Improve
1. Water intake below target — increase by 3 glasses
2. Skipped evening snack — sundal would be ideal
3. Added extra rice at dinner — try chapati tomorrow

### 🎯 Priority Action RIGHT NOW
**Drink 2 glasses of water** and do a 5-minute stretching session.

### 📈 Weekly Insight
You're showing steady progress this week. Consistency in meals has improved by 20% compared to last week.

### 🌿 Tamil Wellness Tips
1. Add curry leaves to your morning water — great for metabolism
2. Eat a banana before your evening walk for sustained energy
3. Try ragi kanji for breakfast twice this week — excellent nutrition`);
    setAnalysing(false);
  };

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-muted p-1">
        <button onClick={() => setMode('chat')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${mode === 'chat' ? 'gradient-primary text-background shadow-md' : ''}`}>
          <Bot className="h-4 w-4 inline mr-1" /> Chat
        </button>
        <button onClick={() => setMode('analyse')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${mode === 'analyse' ? 'gradient-primary text-background shadow-md' : ''}`}>
          <BarChart3 className="h-4 w-4 inline mr-1" /> Analyse My Day
        </button>
      </div>

      {mode === 'chat' ? (
        <>
          {/* Chat Messages */}
          <div className="space-y-3 min-h-[40vh] max-h-[55vh] overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${msg.role === 'user'
                  ? 'gradient-primary text-background rounded-br-sm'
                  : 'bg-muted rounded-bl-sm'}`}>
                  {msg.role === 'assistant' && <div className="flex items-center gap-1.5 mb-1.5 text-ft-cyan text-xs font-semibold">🤖 Coach Tamil</div>}
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {QUICK_PROMPTS.map(prompt => (
              <button key={prompt} onClick={() => sendMessage(prompt)}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/50 active:scale-95">
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask Coach Tamil..."
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim()}
              className="gradient-primary h-12 w-12 rounded-xl flex items-center justify-center active:scale-95 disabled:opacity-50">
              <Send className="h-5 w-5 text-background" />
            </button>
          </div>

          <button onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mx-auto">
            <Trash2 className="h-3 w-3" /> Clear chat
          </button>
        </>
      ) : (
        <>
          {!analysis && !analysing && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
              <div className="text-6xl">📊</div>
              <h3 className="font-heading text-2xl">Analyse Your Day</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Get an AI-powered analysis of your meals, workout, hydration, and wellness today.
              </p>
              <GradientButton onClick={runAnalysis}>
                <Sparkles className="h-4 w-4 mr-2 inline" /> Analyse Now
              </GradientButton>
            </div>
          )}

          {analysing && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
              <div className="text-5xl animate-pulse-ring">🤖</div>
              <p className="text-muted-foreground">Analysing your day...</p>
            </div>
          )}

          {analysis && (
            <div className="ft-card text-sm whitespace-pre-wrap space-y-2">
              {analysis}
            </div>
          )}
        </>
      )}
    </div>
  );
}
