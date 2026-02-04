import { useState } from 'react';
import type { Recipe, MealTag } from '@recipe-app/shared';
import { parseIngredients } from '@recipe-app/shared';

interface RecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, 'id'>) => void;
  initialRecipe?: Recipe;
}

const allTags: MealTag[] = [
  'breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'side', 'main', 'appetizer',
  'vegetarian', 'vegan', 'egg-free', 'gluten-free'
];

export function RecipeForm({ onSubmit, initialRecipe }: RecipeFormProps) {
  const [title, setTitle] = useState(initialRecipe?.title ?? '');
  const [servings, setServings] = useState(initialRecipe?.servings ?? 4);
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime ?? 15);
  const [cookTime, setCookTime] = useState(initialRecipe?.cookTime ?? 30);
  const [ovenTemp, setOvenTemp] = useState(initialRecipe?.ovenTemp ?? 0);
  const [ovenTempUnit, setOvenTempUnit] = useState<'F' | 'C'>(initialRecipe?.ovenTempUnit ?? 'F');
  const [selectedTags, setSelectedTags] = useState<MealTag[]>(initialRecipe?.tags ?? []);
  const [sourceUrl, setSourceUrl] = useState(initialRecipe?.sourceUrl ?? '');
  const [ingredientText, setIngredientText] = useState('');
  const [instructionText, setInstructionText] = useState('');

  const handleTagToggle = (tag: MealTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ingredients = parseIngredients(ingredientText);

    const instructions = instructionText
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.trim());

    onSubmit({
      title,
      servings,
      prepTime,
      cookTime,
      ...(ovenTemp > 0 && { ovenTemp, ovenTempUnit }),
      ingredients,
      instructions,
      tags: selectedTags,
      ...(sourceUrl && { sourceUrl }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter recipe title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            min={1}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(Number(e.target.value))}
            min={0}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(Number(e.target.value))}
            min={0}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Oven Temp (optional)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={ovenTemp || ''}
              onChange={(e) => setOvenTemp(Number(e.target.value))}
              min={0}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Temp"
            />
            <select
              value={ovenTempUnit}
              onChange={(e) => setOvenTempUnit(e.target.value as 'F' | 'C')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="F">°F</option>
              <option value="C">°C</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ingredients (one per line)
        </label>
        <textarea
          value={ingredientText}
          onChange={(e) => setIngredientText(e.target.value)}
          rows={6}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="1 cup - 2 tbsp flour&#10;2 large eggs&#10;1/2 tsp salt"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions (one step per line)
        </label>
        <textarea
          value={instructionText}
          onChange={(e) => setInstructionText(e.target.value)}
          rows={6}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Preheat oven to 350°F&#10;Mix dry ingredients&#10;Add wet ingredients"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Source URL (optional)</label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/recipe"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
      >
        Save Recipe
      </button>
    </form>
  );
}
