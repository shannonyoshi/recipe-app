import type { MealTag } from '@recipe-app/shared';

interface TagBadgeProps {
  tag: MealTag;
}

const tagColors: Record<MealTag, string> = {
  breakfast: 'bg-yellow-100 text-yellow-800',
  lunch: 'bg-green-100 text-green-800',
  dinner: 'bg-blue-100 text-blue-800',
  dessert: 'bg-pink-100 text-pink-800',
  snack: 'bg-orange-100 text-orange-800',
  side: 'bg-gray-100 text-gray-800',
  main: 'bg-indigo-100 text-indigo-800',
  appetizer: 'bg-purple-100 text-purple-800',
  vegetarian: 'bg-emerald-100 text-emerald-800',
  vegan: 'bg-lime-100 text-lime-800',
  'egg-free': 'bg-amber-100 text-amber-800',
  'gluten-free': 'bg-cyan-100 text-cyan-800',
};

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[tag]}`}>
      {tag}
    </span>
  );
}
