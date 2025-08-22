import { Sparkles, Heart, Scissors, Palette, Gift } from 'lucide-react';

const categoryIcons = {
  'Skincare': Sparkles,
  'Bodycare': Heart,
  'Haircare': Scissors,
  'Make-up': Palette,
  'Accessories': Gift,
};

function MobileNavigation({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isActive = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex-1 flex flex-col items-center py-3 px-2 transition-all ${
                isActive 
                  ? 'text-pink-500 bg-pink-50' 
                  : 'text-gray-500 hover:text-pink-400'
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-pink-500' : ''}`} />
              <span className="text-xs font-medium">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileNavigation;