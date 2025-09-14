import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import SearchSuggestions from './SearchSuggestions';

function SearchBar({ onSearch, searchQuery, onClear }) {
  const [inputValue, setInputValue] = useState(searchQuery || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        onSearch(inputValue.trim());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch, searchQuery]);

  // Update input value when searchQuery prop changes
  useEffect(() => {
    setInputValue(searchQuery || '');
  }, [searchQuery]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setInputValue('');
    onClear();
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (inputValue && inputValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    onSearch(suggestion.trim());
    setShowSuggestions(false);
    setIsFocused(false);
    
    // Add to search history
    addToSearchHistory(suggestion.trim());
  };

  const addToSearchHistory = (query) => {
    if (query && query.length > 0) {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        onSearch(trimmedValue);
        addToSearchHistory(trimmedValue);
        setShowSuggestions(false);
        setIsFocused(false);
      }
    }
  };

  return (
    <div className="relative max-w-md mx-auto mb-6 z-50" data-aos="fade-up" ref={containerRef}>
      <div className="relative z-50">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari produk, merek, atau kategori..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
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
        
        <SearchSuggestions
          query={inputValue}
          onSelectSuggestion={handleSelectSuggestion}
          isVisible={showSuggestions && isFocused}
          onClose={handleCloseSuggestions}
          searchHistory={searchHistory}
        />
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
