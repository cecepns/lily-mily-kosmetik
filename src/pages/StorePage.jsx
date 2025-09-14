import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiEndpoints } from '../config/api';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import MobileNavigation from '../components/MobileNavigation';
import Header from '../components/Header';
import ReviewSection from '../components/ReviewSection';
import Hero from '../components/Hero';
import FindUsSection from '../components/FindUsSection';

const categories = ['Skincare', 'Bodycare', 'Haircare', 'Make-up', 'Accessories'];

function StorePage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      };
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await axios.get(apiEndpoints.products, { params });
      
      // Handle paginated response
      if (response.data.products) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);
      } else {
        // Fallback for non-paginated response
        setProducts(response.data);
        setTotalPages(1);
        setTotalProducts(response.data.length);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset to first page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Search handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Header />
      
      <Hero />
      
      {/* Search Bar */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <SearchBar 
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onClear={handleClearSearch}
          />
        </div>
      </div>
      
      {/* Desktop Category Filter */}
      <div className="hidden md:block bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === '' 
                  ? 'bg-pink-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
              }`}
              data-aos="fade-up"
            >
              Semua Produk
            </button>
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category 
                    ? 'bg-pink-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="text-center mb-8" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {searchQuery 
              ? `Hasil Pencarian: "${searchQuery}"` 
              : selectedCategory || 'Semua Produk'
            }
          </h2>
          <p className="text-gray-600">
            {searchQuery 
              ? `Menampilkan produk yang sesuai dengan pencarian Anda` 
              : 'Temukan produk kecantikan terbaik untuk Anda'
            }
          </p>
          {totalProducts > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Menampilkan {products.length} dari {totalProducts} produk
              {searchQuery && ` untuk "${searchQuery}"`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            <ProductGrid products={products} />
            
            {/* Pagination */}
            {totalPages > 1 && products.length > 0 && (
              <div className="flex justify-center items-center py-8 mt-8" data-aos="fade-up">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (typeof page === 'number') {
                          handlePageChange(page);
                        }
                      }}
                      className={`p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors ${
                        typeof page === 'number' && page === currentPage
                          ? 'bg-pink-500 text-white'
                          : ''
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>

      <ReviewSection />

      <FindUsSection />

      <MobileNavigation 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
}

export default StorePage;