import { useState } from 'react';
import { AIPlan } from '@/types/fitness';

interface Recipe {
  name: string;
  calories: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks';
  time: string;
  ingredients: string[];
  method: string[];
}

const RECIPES: Recipe[] = [
  {
    name: 'Egg Dosa', calories: 385, category: 'breakfast', time: '15 min',
    ingredients: ['1 cup dosa batter', '2 eggs', '1 onion chopped', 'Green chillies', 'Curry leaves', 'Salt', 'Oil'],
    method: ['Heat tawa, pour dosa batter thinly', 'Crack egg on top, spread evenly', 'Sprinkle onion, chillies, curry leaves', 'Cook on medium heat until crispy', 'Fold and serve with sambar & chutney'],
  },
  {
    name: 'Ragi Dosai', calories: 340, category: 'breakfast', time: '20 min',
    ingredients: ['1 cup ragi flour', '½ cup rice flour', '1 onion', 'Cumin seeds', 'Curry leaves', 'Salt', 'Water'],
    method: ['Mix ragi flour, rice flour with water to batter consistency', 'Add cumin, curry leaves, chopped onion', 'Rest 15 min', 'Pour on hot tawa, cook both sides', 'Serve with coconut chutney'],
  },
  {
    name: 'Pesarattu', calories: 360, category: 'breakfast', time: '25 min',
    ingredients: ['1 cup green moong dal (soaked 4hr)', '2 green chillies', '1 inch ginger', 'Cumin seeds', 'Salt', 'Oil'],
    method: ['Grind soaked moong with chillies, ginger, cumin', 'Add salt, make batter consistency', 'Pour on hot tawa like dosa', 'Cook until golden on both sides', 'Serve with ginger chutney & upma'],
  },
  {
    name: 'Pepper Rasam', calories: 35, category: 'lunch', time: '20 min',
    ingredients: ['2 tomatoes', '1 tsp pepper', '1 tsp cumin', 'Tamarind extract', 'Garlic 3 cloves', 'Curry leaves', 'Mustard seeds', 'Hing'],
    method: ['Boil tomatoes till mushy', 'Dry roast pepper & cumin, powder coarsely', 'Add tamarind extract, crushed garlic, powder', 'Boil 5 min, temper with mustard, curry leaves, hing', 'Serve hot with rice or drink as soup'],
  },
  {
    name: 'Fish Kuzhambu', calories: 220, category: 'lunch', time: '30 min',
    ingredients: ['250g seer fish pieces', '2 tomatoes', '1 onion', 'Tamarind', 'Sambar powder', 'Fenugreek seeds', 'Curry leaves', 'Coconut oil'],
    method: ['Marinate fish with turmeric and salt', 'Sauté onion, add tomatoes till soft', 'Add tamarind extract, sambar powder, fenugreek', 'Simmer 10 min, add fish pieces', 'Cook 8-10 min on low, garnish with curry leaves'],
  },
  {
    name: 'Keerai Masiyal', calories: 120, category: 'dinner', time: '20 min',
    ingredients: ['2 bunches spinach/keerai', '½ cup toor dal', 'Small onion 5', '2 dried red chillies', 'Garlic 3 cloves', 'Cumin', 'Coconut oil'],
    method: ['Pressure cook keerai with dal, onions, garlic', 'Mash well after cooking', 'Temper with coconut oil, cumin, dried chillies', 'Add to mashed keerai, mix well', 'Serve with hot rice and ghee'],
  },
  {
    name: 'Upgraded Amla Water', calories: 12, category: 'drinks', time: '5 min',
    ingredients: ['2 fresh amla (grated)', '1 glass warm water', '½ tsp honey (optional)', 'Pinch of black salt', 'Few mint leaves'],
    method: ['Grate fresh amla, add to warm water', 'Add black salt and mint leaves', 'Stir well, let steep 2 min', 'Add honey if desired', 'Drink first thing in the morning on empty stomach'],
  },
];

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks'] as const;

export function Recipes() {
  const [filter, setFilter] = useState<string>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'All'
    ? RECIPES
    : RECIPES.filter(r => r.category === filter.toLowerCase());

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === f ? 'gradient-primary text-background' : 'border border-border text-muted-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recipe cards */}
      <div className="space-y-3">
        {filtered.map(recipe => (
          <button
            key={recipe.name}
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
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-ft-cyan">•</span> {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ft-violet mb-2">Method</h4>
                  <ol className="space-y-1.5">
                    {recipe.method.map((step, i) => (
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
    </div>
  );
}
