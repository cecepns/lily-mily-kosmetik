import { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { apiEndpoints } from '../../config/api';
import API_BASE_URL from '../../config/api';

function ProductForm({ product, brands, categories, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    online_store_link: '',
    brand_id: '',
    category_id: '',
    image: null,
    existing_image: ''
  });


  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Reset form data when product changes
    if (product) {
      const newFormData = {
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        online_store_link: product.online_store_link || '',
        brand_id: product.brand_id?.toString() || '',
        category_id: product.category_id?.toString() || '',
        image: null,
        existing_image: product.image || ''
      };
      setFormData(newFormData);
      
      if (product.image) {
        setImagePreview(`${API_BASE_URL.replace('/api', '')}/uploads/${product.image}`);
      } else {
        setImagePreview('');
      }
    } else {
      // Reset form when no product (adding new product)
      const emptyFormData = {
        name: '',
        description: '',
        price: '',
        online_store_link: '',
        brand_id: '',
        category_id: '',
        image: null,
        existing_image: ''
      };
      setFormData(emptyFormData);
      setImagePreview('');
    }
  }, [product]); // Depend on the entire product object to ensure form resets properly

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('online_store_link', formData.online_store_link);
      submitData.append('brand_id', formData.brand_id);
      submitData.append('category_id', formData.category_id);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      } else if (formData.existing_image) {
        submitData.append('existing_image', formData.existing_image);
      }

      if (product) {
        await axios.put(apiEndpoints.productById(product.id), submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(apiEndpoints.products, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Toko Online
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={formData.online_store_link}
                onChange={(e) => setFormData({ ...formData, online_store_link: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk
            </label>
            {imagePreview ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <img src={imagePreview} alt="Preview" className="h-32 mx-auto rounded-lg object-cover" />
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Trigger file input click
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'image/*';
                      fileInput.onchange = handleImageChange;
                      fileInput.click();
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Ganti Gambar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImagePreview('');
                      setFormData({ ...formData, image: null, existing_image: '' });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Hapus Gambar
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors relative">
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Klik untuk upload gambar</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Produk
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              modules={quillModules}
              className="bg-white"
              key={`quill-${product?.id || 'new'}`}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : (product ? 'Update' : 'Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;