import { Link } from 'react-router';
import type { Recipe } from '@recipe-app/shared';
import { TagBadge } from './TagBadge';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
      <div className="text-sm text-gray-600 mb-3">
        <span>{totalTime} min</span>
        <span className="mx-2">•</span>
        <span>{recipe.servings} servings</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {recipe.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </Link>
  );
}
