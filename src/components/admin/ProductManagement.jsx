import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload, Download, AlertCircle, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { apiEndpoints } from '../../config/api';
import ProductForm from './ProductForm';
import API_BASE_URL from '../../config/api';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage] = useState(4);
  
  // Excel import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccess, setImportSuccess] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filterCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for pagination and filtering
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (filterCategory) {
        params.append('category', filterCategory);
      }
      
      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        axios.get(`${apiEndpoints.products}?${params.toString()}`),
        axios.get(apiEndpoints.brands),
        axios.get(apiEndpoints.categories)
      ]);
      
      // Handle paginated response
      if (productsRes.data.products) {
        setProducts(productsRes.data.products);
        setTotalPages(productsRes.data.totalPages);
        setTotalProducts(productsRes.data.totalProducts);
      } else {
        // Fallback for non-paginated response
        setProducts(productsRes.data);
        setTotalPages(1);
        setTotalProducts(productsRes.data.length);
      }
      
      setBrands(brandsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  // Excel import functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Remove header row and process data
        const headers = data[0];
        const rows = data.slice(1);
        
        const processedData = rows.map((row, index) => {
          const product = {};
          headers.forEach((header, colIndex) => {
            if (header && row[colIndex] !== undefined) {
              product[header.toLowerCase().replace(/\s+/g, '_')] = row[colIndex];
            }
          });
          return { ...product, rowIndex: index + 2 }; // +2 because we removed header and arrays are 0-indexed
        }).filter(product => product.name); // Only include rows with product names

        setImportData(processedData);
        
        // Process validation immediately after reading the file
        const processedProducts = [];
        const errors = [];
        const success = [];

        processedData.forEach((product, index) => {
          const validationErrors = validateProductData(product);
          
          if (validationErrors.length > 0) {
            errors.push({
              row: product.rowIndex,
              product: product.name || `Baris ${product.rowIndex}`,
              errors: validationErrors
            });
            return;
          }

          // Validate brand and category existence
          const brandCategoryErrors = validateBrandAndCategory(product.brand_id, product.category_id);
          if (brandCategoryErrors.length > 0) {
            errors.push({
              row: product.rowIndex,
              product: product.name,
              errors: brandCategoryErrors
            });
            return;
          }

          const processedProduct = {
            name: product.name.trim(),
            description: product.description || '',
            price: parseFloat(product.price),
            online_store_link: product.online_store_link || '',
            brand_id: parseInt(product.brand_id),
            category_id: parseInt(product.category_id)
          };

          processedProducts.push(processedProduct);
          success.push({
            row: product.rowIndex,
            product: product.name,
            message: 'Data valid'
          });
        });

        setImportErrors(errors);
        setImportSuccess(success);
        setShowImportModal(true);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Gagal membaca file Excel. Pastikan format file benar.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const validateProductData = (product) => {
    const errors = [];
    
    if (!product.name || product.name.trim() === '') {
      errors.push('Nama produk wajib diisi');
    }
    
    if (!product.price || isNaN(product.price)) {
      errors.push('Harga harus berupa angka');
    }
    
    if (!product.brand_id || isNaN(product.brand_id)) {
      errors.push('Brand ID wajib diisi dan harus berupa angka');
    }
    
    if (!product.category_id || isNaN(product.category_id)) {
      errors.push('Category ID wajib diisi dan harus berupa angka');
    }
    
    return errors;
  };

  const validateBrandAndCategory = (brandId, categoryId) => {
    const errors = [];
    
    const brandExists = brands.find(b => b.id === parseInt(brandId));
    if (!brandExists) {
      errors.push(`Brand ID ${brandId} tidak ditemukan`);
    }
    
    const categoryExists = categories.find(c => c.id === parseInt(categoryId));
    if (!categoryExists) {
      errors.push(`Category ID ${categoryId} tidak ditemukan`);
    }
    
    return errors;
  };



  const handleBulkImport = async () => {
    if (importSuccess.length === 0) {
      alert('Tidak ada data yang valid untuk diimport');
      return;
    }

    // Create processed products from importData based on successful validation
    const processedProducts = importData
      .filter(product => {
        // Check if this product is in the success list
        return importSuccess.some(success => success.row === product.rowIndex);
      })
      .map(product => ({
        name: product.name.trim(),
        description: product.description || '',
        price: parseFloat(product.price),
        online_store_link: product.online_store_link || '',
        brand_id: parseInt(product.brand_id),
        category_id: parseInt(product.category_id)
      }));

    setIsImporting(true);
    setImportProgress(0);

    try {
      const response = await axios.post(apiEndpoints.bulkProducts, {
        products: processedProducts
      });

      setImportProgress(100);
      alert(`Berhasil mengimport ${response.data.insertedCount} produk`);
      
      // Clear import data and close modal
      clearImportData();
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error importing products:', error);
      alert('Gagal mengimport produk: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Create template with ID columns and helper sheets
    const template = [
      ['name', 'description', 'price', 'online_store_link', 'brand_id', 'category_id'],
      ['Lipstik Matte', 'Lipstik matte tahan lama', '150000', 'https://example.com', '1', '1'],
      ['Foundation', 'Foundation untuk kulit normal', '250000', 'https://example.com', '2', '2']
    ];

    // Create helper sheets for brands and categories
    const brandsSheet = [
      ['brand_id', 'brand_name'],
      ...brands.map(brand => [brand.id.toString(), brand.name])
    ];

    const categoriesSheet = [
      ['category_id', 'category_name'],
      ...categories.map(category => [category.id.toString(), category.name])
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const brandsWs = XLSX.utils.aoa_to_sheet(brandsSheet);
    const categoriesWs = XLSX.utils.aoa_to_sheet(categoriesSheet);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.utils.book_append_sheet(wb, brandsWs, 'Daftar Brand');
    XLSX.utils.book_append_sheet(wb, categoriesWs, 'Daftar Kategori');
    
    XLSX.writeFile(wb, 'template_produk.xlsx');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(apiEndpoints.productById(id));
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchData();
  };

  const clearImportData = () => {
    setImportData([]);
    setImportErrors([]);
    setImportSuccess([]);
    setImportProgress(0);
    setIsImporting(false);
    setShowImportModal(false);
  };

  const resetImportData = () => {
    setImportData([]);
    setImportErrors([]);
    setImportSuccess([]);
    setImportProgress(0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8" data-aos="fade-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
          <p className="text-gray-600 mt-2">Kelola produk kosmetik Anda</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Import Excel</span>
          </button>
          <button
            onClick={downloadTemplate}
            className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Template</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-aos="fade-up" data-aos-delay="100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk atau brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Semua Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="200">
        {/* Pagination Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Menampilkan {products.length} dari {totalProducts} produk
              {searchTerm && ` untuk pencarian "${searchTerm}"`}
              {filterCategory && ` dalam kategori "${filterCategory}"`}
            </div>
            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak Ada Produk</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterCategory 
                        ? 'Tidak ada produk yang sesuai dengan filter yang dipilih'
                        : 'Belum ada produk yang ditambahkan'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image ? (
                          <img
                            src={`${API_BASE_URL.replace(/\/api$/, '')}/uploads/${product.image}`}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                            📷
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{product.brand_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                        {product.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingProduct({...product}); // Create a new object reference
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

              {/* Pagination */}
        {totalPages > 1 && products.length > 0 && (
          <div className="flex justify-center items-center py-6" data-aos="fade-up" data-aos-delay="300">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className={`p-2 rounded-full text-gray-600 hover:bg-gray-200 ${
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
                className="p-2 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Import Produk dari Excel</h2>
              <button
                onClick={clearImportData}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {importData.length === 0 ? (
              <div className="text-center py-8">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload File Excel</h3>
                <p className="text-gray-600 mb-4">
                  Pilih file Excel (.xlsx) yang berisi data produk. Pastikan format sesuai dengan template. 
                  Template menggunakan brand_id dan category_id (angka), bukan nama brand/kategori.
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                <div className="mt-4">
                  <button
                    onClick={downloadTemplate}
                    className="text-pink-600 hover:text-pink-700 text-sm flex items-center space-x-1 mx-auto"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Template Excel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Data ({importData.length} produk)</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Kolom yang diperlukan:</strong> name, description, price, online_store_link, brand_id, category_id
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Catatan:</strong> Gunakan brand_id dan category_id (angka), bukan nama. Lihat sheet "Daftar Brand" dan "Daftar Kategori" di template untuk referensi ID.
                    </p>
                  </div>
                </div>

                {/* Validation Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Success */}
                  {importSuccess.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium text-green-800">Data Valid ({importSuccess.length})</h4>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {importSuccess.map((item, index) => (
                          <div key={index} className="text-sm text-green-700 mb-1">
                            Baris {item.row}: {item.product}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {importErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <h4 className="font-medium text-red-800">Error ({importErrors.length})</h4>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {importErrors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700 mb-2">
                            <div className="font-medium">Baris {error.row}: {error.product}</div>
                            <ul className="ml-4 list-disc">
                              {error.errors.map((err, errIndex) => (
                                <li key={errIndex}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {isImporting && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Mengimport produk...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={resetImportData}
                    className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                    disabled={isImporting}
                  >
                    Reset
                  </button>
                  <button
                    onClick={clearImportData}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isImporting}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleBulkImport}
                    disabled={isImporting || importSuccess.length === 0}
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Mengimport...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Import {importSuccess.length} Produk</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          brands={brands}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default ProductManagement;