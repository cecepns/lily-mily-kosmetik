import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import axios from 'axios';
import { apiEndpoints } from '../../config/api';
import API_BASE_URL from '../../config/api';

function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    existing_logo: ''
  });
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiEndpoints.brands);
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      
      if (formData.logo) {
        submitData.append('logo', formData.logo);
      } else if (formData.existing_logo) {
        submitData.append('existing_logo', formData.existing_logo);
      }

      if (editingBrand) {
        await axios.put(apiEndpoints.brandById(editingBrand.id), submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(apiEndpoints.brands, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setShowForm(false);
      setEditingBrand(null);
      resetForm();
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Gagal menyimpan brand');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus brand ini?')) {
      try {
        await axios.delete(apiEndpoints.brandById(id));
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Gagal menghapus brand');
      }
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo: null,
      existing_logo: brand.logo || ''
    });
    if (brand.logo) {
      setLogoPreview(`${API_BASE_URL.replace('/api', '')}/uploads/${brand.logo}`);
    }
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: null,
      existing_logo: ''
    });
    setLogoPreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8" data-aos="fade-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Brand</h1>
          <p className="text-gray-600 mt-2">Kelola brand produk kosmetik</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Brand</span>
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
        {brands.map((brand, index) => (
          <div
            key={brand.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="flex items-center justify-between mb-4">
              {brand.logo ? (
                <img
                  src={`${API_BASE_URL.replace('/api', '')}/uploads/${brand.logo}`}
                  alt={brand.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center">
                  <span className="text-pink-500 font-bold text-lg">{brand.name.charAt(0)}</span>
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <span className="text-white bg-blue-500 rounded-lg py-1 px-2 text-xs">Brand ID : {brand.id}</span>
            <h3 className="font-semibold text-gray-800 mb-2">{brand.name}</h3>
            <p className="text-gray-600 text-sm">{brand.description}</p>
          </div>
        ))}
      </div>

      {/* Brand Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingBrand ? 'Edit Brand' : 'Tambah Brand Baru'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingBrand(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Brand *
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
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Brand
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition-colors relative">
                  {logoPreview ? (
                    <div className="space-y-2">
                      <img src={logoPreview} alt="Preview" className="h-20 mx-auto rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview('');
                          setFormData({ ...formData, logo: null, existing_logo: '' });
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Hapus Logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Upload logo brand</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 1 }}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBrand(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : (editingBrand ? 'Update' : 'Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandManagement;