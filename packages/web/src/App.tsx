import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import type { Recipe } from '@recipe-app/shared';
import { mockRecipes } from './data/mockRecipes';
import { RecipeList } from './pages/RecipeList';
import { RecipeDetail } from './pages/RecipeDetail';
import { AddRecipe } from './pages/AddRecipe';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);

  const handleAddRecipe = (newRecipe: Omit<Recipe, 'id'>) => {
    const id = Math.max(0, ...recipes.map((r) => r.id)) + 1;
    setRecipes([...recipes, { ...newRecipe, id }]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeList recipes={recipes} />} />
        <Route path="/recipe/:id" element={<RecipeDetail recipes={recipes} />} />
        <Route path="/add" element={<AddRecipe onAddRecipe={handleAddRecipe} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
