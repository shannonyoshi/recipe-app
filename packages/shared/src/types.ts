export type MealTag = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'side' | 'main' | 'appetizer' | 'vegetarian' | 'vegan' | 'egg-free' | 'gluten-free'


export interface Measurement {
  amount: number;
  unit: string;
}

export interface Ingredient {
  id: number;
  name: string;
  originalMeasurements: Measurement[];
  amount: number | null;
  unit: string | null;
  category: string;
}

export interface Recipe {
  id: number;
  title: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  ovenTemp?: number;
  ovenTempUnit?: 'F' | 'C';
  ingredients: Ingredient[];
  instructions: string[];
  tags: MealTag[];
  sourceUrl?: string;
}
