import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../config/api';

function SearchSuggestions({ query, onSelectSuggestion, isVisible, onClose, searchHistory = [] }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query && query.length >= 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await axios.get(apiEndpoints.products, {
        params: {
          search: searchQuery,
          limit: 5
        }
      });

      if (response.data.products) {
        const uniqueSuggestions = [];
        const seen = new Set();

        response.data.products.forEach(product => {
          // Add product name suggestions
          if (!seen.has(product.name.toLowerCase())) {
            uniqueSuggestions.push({
              type: 'product',
              text: product.name,
              category: product.category_name
            });
            seen.add(product.name.toLowerCase());
          }

          // Add brand name suggestions
          if (product.brand_name && !seen.has(product.brand_name.toLowerCase())) {
            uniqueSuggestions.push({
              type: 'brand',
              text: product.brand_name,
              category: 'Merek'
            });
            seen.add(product.brand_name.toLowerCase());
          }

          // Add category suggestions
          if (product.category_name && !seen.has(product.category_name.toLowerCase())) {
            uniqueSuggestions.push({
              type: 'category',
              text: product.category_name,
              category: 'Kategori'
            });
            seen.add(product.category_name.toLowerCase());
          }
        });

        setSuggestions(uniqueSuggestions.slice(0, 8)); // Limit to 8 suggestions
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Show search history when there's no query or query is too short
  const showHistory = (!query || query.length < 2) && searchHistory.length > 0;
  const showSuggestions = query && query.length >= 2 && suggestions.length > 0;

  if (!isVisible || (!showHistory && !showSuggestions)) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-[9999] max-h-80 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-sm mt-2">Mencari saran...</p>
        </div>
      ) : (
        <div className="py-2">
          {/* Search History */}
          {showHistory && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pencarian Terbaru
              </div>
              {searchHistory.map((item, index) => (
                <button
                  key={`history-${index}`}
                  onClick={() => {
                    onSelectSuggestion(item);
                    onClose();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center"
                >
                  <div className="w-4 h-4 mr-3 text-gray-400">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v6a7 7 0 11-14 0V9a1 1 0 112 0v2.5a.5.5 0 001 0V4a1 1 0 112 0v5.5a.5.5 0 001 0V3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 my-2"></div>
            </>
          )}
          
          {/* Search Suggestions */}
          {showSuggestions && suggestions.map((suggestion, index) => (
            <button
              key={`suggestion-${index}`}
              onClick={() => {
                onSelectSuggestion(suggestion.text);
                onClose();
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-gray-900">{suggestion.text}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {suggestion.type === 'product' && 'Produk'}
                  {suggestion.type === 'brand' && 'Merek'}
                  {suggestion.type === 'category' && 'Kategori'}
                </div>
              </div>
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                {suggestion.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;
