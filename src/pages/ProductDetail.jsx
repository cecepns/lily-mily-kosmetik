import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, Share2 } from 'lucide-react';
import axios from 'axios';
import { apiEndpoints } from '../config/api';
import API_BASE_URL from '../config/api';
import OrdersSection from '../components/OrdersSection';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiEndpoints.productById(id));
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Lihat produk ${product.name} di Toko Kosmetik Ariani`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produk Tidak Ditemukan</h2>
          <Link to="/" className="text-pink-500 hover:text-pink-600">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-600 hover:text-pink-500">
              <ArrowLeft className="h-6 w-6" />
              <span className="ml-2 font-medium">Kembali</span>
            </Link>
            <button 
              onClick={handleShare}
              className="flex items-center text-gray-600 hover:text-pink-500"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              {product.image ? (
                <img
                  src={`${API_BASE_URL.replace(/\/api$/, '')}/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-64 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <span className="text-pink-400 text-6xl">📷</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-pink-100 text-pink-600 text-sm font-medium px-3 py-1 rounded-full">
                  {product.category_name}
                </span>
                {/* <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-500 ml-1">4.8 (124 ulasan)</span>
                </div> */}
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">Brand: {product.brand_name}</p>
              
              <div className="text-3xl font-bold text-pink-600 mb-6">
                {formatPrice(product.price)}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Deskripsi Produk</h3>
                  <div 
                    className="prose prose-pink max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {product.online_store_link && (
                <a
                  href={product.online_store_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  <span>Beli Sekarang</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <OrdersSection />
    </div>
  );
}

export default ProductDetail;