import { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Recipe {
  name: string;
  calories: number;
  category: string;
  time: string;
  ingredients: string[];
  method: string[];
}

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Snack'] as const;

export function Recipes() {
  const [filter, setFilter] = useState<string>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchRecipes = useCallback(async (query?: string) => {
    const q = query || search.trim();
    if (!q && filter === 'All') {
      // Default search
    }
    setSearching(true);
    setHasSearched(true);
    try {
      const searchQuery = q || (filter !== 'All' ? `Tamil ${filter} recipes` : 'popular Tamil Nadu recipes');
      const { data, error } = await supabase.functions.invoke('search-food', {
        body: { query: searchQuery, type: 'recipe' },
      });
      if (error) throw error;
      setRecipes(data?.results || []);
    } catch (e) {
      console.error('Recipe search failed:', e);
      toast.error('Recipe search failed');
    } finally {
      setSearching(false);
    }
  }, [search, filter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchRecipes();
  };

  const filtered = filter === 'All'
    ? recipes
    : recipes.filter(r => r.category?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search recipes (e.g., chicken biryani, ragi dosa)..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
          />
        </div>
        <button onClick={() => searchRecipes()} disabled={searching}
          className="w-full gradient-primary text-background rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
          {searching ? <><Loader2 className="h-4 w-4 animate-spin" /> Searching...</> : '🔍 Search Recipes Online'}
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); if (hasSearched) searchRecipes(f !== 'All' ? `Tamil ${f} recipes` : undefined); }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === f ? 'gradient-primary text-background' : 'border border-border text-muted-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading */}
      {searching && (
        <div className="text-center py-10 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
          <p className="text-sm">Finding delicious recipes...</p>
        </div>
      )}

      {/* Empty state */}
      {!searching && !hasSearched && (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🍳</p>
          <h3 className="font-heading text-xl mb-1">Search Any Recipe</h3>
          <p className="text-sm text-muted-foreground">Type a dish name or ingredient and search to find recipes with ingredients, method, and calories.</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['Chicken Biryani', 'Ragi Dosa', 'Sambar', 'Paneer Butter Masala', 'Fish Curry'].map(q => (
              <button key={q} onClick={() => { setSearch(q); searchRecipes(q); }}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {!searching && hasSearched && filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">No recipes found. Try a different search.</p>
      )}

      {/* Recipe cards */}
      {!searching && (
        <div className="space-y-3">
          {filtered.map((recipe, idx) => (
            <button
              key={`${recipe.name}-${idx}`}
              onClick={() => setExpanded(expanded === recipe.name ? null : recipe.name)}
              className="w-full ft-card text-left transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{recipe.name}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className="font-mono text-xs text-ft-cyan">{recipe.calories} kcal</span>
                    <span className="text-xs text-muted-foreground">⏱ {recipe.time}</span>
                    <span className="text-xs capitalize text-muted-foreground">{recipe.category}</span>
                  </div>
                </div>
                <span className="text-lg">{expanded === recipe.name ? '▲' : '▼'}</span>
              </div>

              {expanded === recipe.name && (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <div>
                    <h4 className="text-sm font-semibold text-ft-emerald mb-2">Ingredients</h4>
                    <ul className="space-y-1">
                      {recipe.ingredients?.map((ing, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-ft-cyan">•</span> {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ft-violet mb-2">Method</h4>
                    <ol className="space-y-1.5">
                      {recipe.method?.map((step, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="font-mono text-xs text-ft-amber shrink-0">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
