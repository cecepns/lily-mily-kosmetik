import { Link } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import API_BASE_URL from '../config/api';

function ProductGrid({ products }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20" data-aos="fade-up">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Produk Tidak Ditemukan</h3>
        <p className="text-gray-500">Coba kata kunci lain, kategori lain, atau hubungi kami untuk produk yang Anda cari</p>
        <div className="mt-4 text-sm text-gray-400">
          <p>Tips pencarian:</p>
          <p>• Coba kata kunci yang lebih umum</p>
          <p>• Periksa ejaan kata kunci</p>
          <p>• Gunakan nama merek atau kategori</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
            {product.image ? (
              <img
                src={`${API_BASE_URL.replace(/\/api$/, '')}/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                <span className="text-pink-400 text-4xl">📷</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                {product.category_name}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 font-medium">{product.brand_name}</span>
              {/* <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-500 ml-1">4.8</span>
              </div> */}
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold text-pink-600">
                {formatPrice(product.price)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Link
                to={`/product/${product.id}`}
                className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors text-center font-medium"
              >
                Detail
              </Link>
              {product.online_store_link && (
                <a
                  href={product.online_store_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;