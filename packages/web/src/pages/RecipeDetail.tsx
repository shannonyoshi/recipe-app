import { Link, useParams } from 'react-router';
import type { Recipe } from '@recipe-app/shared';
import { TagBadge } from '../components/TagBadge';

interface RecipeDetailProps {
  recipes: Recipe[];
}

export function RecipeDetail({ recipes }: RecipeDetailProps) {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block">
            ← Back to recipes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            {recipe.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Prep Time</p>
              <p className="text-lg font-semibold">{recipe.prepTime} min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cook Time</p>
              <p className="text-lg font-semibold">{recipe.cookTime} min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="text-lg font-semibold">{totalTime} min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Servings</p>
              <p className="text-lg font-semibold">{recipe.servings}</p>
            </div>
          </div>
          {recipe.ovenTemp && (
            <div className="mt-4 text-center border-t pt-4">
              <p className="text-sm text-gray-500">Oven Temperature</p>
              <p className="text-lg font-semibold">
                {recipe.ovenTemp}°{recipe.ovenTempUnit}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.sourceUrl && (
          <div className="mt-6 text-center">
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              View original recipe →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
