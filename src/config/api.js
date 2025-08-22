const API_BASE_URL = 'https://api-inventory.isavralabel.com/lilymilykosmetik/api';

export const apiEndpoints = {
  // Auth
  login: `${API_BASE_URL}/auth/login`,
  
  // Products
  products: `${API_BASE_URL}/products`,
  productById: (id) => `${API_BASE_URL}/products/${id}`,
  bulkProducts: `${API_BASE_URL}/products/bulk`,
  
  // Brands
  brands: `${API_BASE_URL}/brands`,
  brandById: (id) => `${API_BASE_URL}/brands/${id}`,
  
  // Categories
  categories: `${API_BASE_URL}/categories`,
  categoryById: (id) => `${API_BASE_URL}/categories/${id}`,
  
  // Reviews
  reviews: `${API_BASE_URL}/reviews`,
  reviewById: (id) => `${API_BASE_URL}/reviews/${id}`,
  
  // File uploads
  upload: `${API_BASE_URL}/upload`,
};

export default API_BASE_URL;