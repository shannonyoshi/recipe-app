import { Link, useNavigate } from 'react-router';
import type { Recipe } from '@recipe-app/shared';
import { RecipeForm } from '../components/RecipeForm';

interface AddRecipeProps {
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => void;
}

export function AddRecipe({ onAddRecipe }: AddRecipeProps) {
  const navigate = useNavigate();

  const handleSubmit = (recipe: Omit<Recipe, 'id'>) => {
    onAddRecipe(recipe);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link to="/" className="text-blue-500 hover:text-blue-600 text-sm mb-2 inline-block">
            ← Back to recipes
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Recipe</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <RecipeForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
