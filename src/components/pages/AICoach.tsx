import { useState, useRef, useEffect } from 'react';
import { GradientButton } from '@/components/shared/GradientButton';
import { Bot, Send, Trash2, Sparkles, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AICoachProps {
  profileSummary: string;
  dailySummary: string;
  planSummary?: string;
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

const CHAT_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/chat`;
const ANALYSE_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/analyse-day`;

export function AICoach({ profileSummary, dailySummary, planSummary }: AICoachProps) {
  const [mode, setMode] = useState<'chat' | 'analyse'>('chat');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: '🤖 Vanakkam! I\'m Coach Tamil, your AI fitness coach. Ask me anything about your diet, workout, or wellness journey!' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: ChatMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const apiMessages = [...messages.slice(-12), userMsg].map(m => ({
        role: m.role, content: m.content,
      }));

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          context: `${profileSummary}\n${dailySummary}`,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || 'Chat failed');
      }

      if (!resp.body) throw new Error('No stream body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantSoFar = '';
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && prev.length > 1 && prev[prev.length - 2]?.role === 'user') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (!assistantSoFar) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I couldn\'t generate a response. Please try again.' }]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      toast.error(err.message || 'Chat failed');
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Sorry, I had trouble connecting. Please try again.' }]);
    } finally {
      setTyping(false);
    }
  };

  const runAnalysis = async () => {
    setAnalysing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyse-day', {
        body: { profileSummary, dailySummary, planSummary: planSummary || '' },
      });

      if (error) throw error;
      setAnalysis(data?.analysis || 'Analysis could not be generated.');
    } catch (err: any) {
      console.error('Analysis error:', err);
      toast.error('Analysis failed. Please try again.');
      setAnalysis(null);
    } finally {
      setAnalysing(false);
    }
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
            {typing && messages[messages.length - 1]?.role !== 'assistant' && (
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
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {QUICK_PROMPTS.map(prompt => (
              <button key={prompt} onClick={() => sendMessage(prompt)}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/50 active:scale-95">
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask Coach Tamil..."
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || typing}
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
            <div className="space-y-3">
              <div className="ft-card text-sm whitespace-pre-wrap">{analysis}</div>
              <button onClick={() => { setAnalysis(null); }}
                className="w-full text-center text-sm text-ft-cyan py-2">
                Run New Analysis
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
