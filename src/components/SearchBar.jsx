import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

function SearchBar({ onSearch, searchQuery, onClear }) {
  const [inputValue, setInputValue] = useState(searchQuery || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        onSearch(inputValue.trim());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch, searchQuery]);

  // Update input value when searchQuery prop changes
  useEffect(() => {
    setInputValue(searchQuery || '');
  }, [searchQuery]);

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className="relative max-w-md mx-auto mb-6" data-aos="fade-up">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari produk, merek, atau kategori..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 placeholder-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {inputValue && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Mencari: <span className="font-medium text-pink-600">"{inputValue}"</span>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
