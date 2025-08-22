import { useState, useEffect } from 'react';
import { Package, Tag, Layers, MessageSquare, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';
import { apiEndpoints } from '../../config/api';

function DashboardHome() {
  const [stats, setStats] = useState({
    products: 0,
    brands: 0,
    categories: 0,
    reviews: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, brands, categories, reviews] = await Promise.all([
        axios.get(apiEndpoints.products),
        axios.get(apiEndpoints.brands),
        axios.get(apiEndpoints.categories),
        axios.get(`${apiEndpoints.reviews}/admin`)
      ]);

      setStats({
        products: products.data.totalProducts || products.data.length,
        brands: brands.data.length,
        categories: categories.data.length,
        reviews: reviews.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Produk',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Brand',
      value: stats.brands,
      icon: Tag,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Kategori',
      value: stats.categories,
      icon: Layers,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Ulasan',
      value: stats.reviews,
      icon: MessageSquare,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div>
      <div className="mb-8" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di panel admin Toko Kosmetik Ariani</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`${stat.bgColor} rounded-xl p-6 hover:shadow-lg transition-shadow`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-right">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 text-pink-500 mr-2" />
            Aktivitas Terbaru
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Produk baru ditambahkan</span>
              <span className="text-sm text-gray-500">2 jam lalu</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Ulasan baru menunggu approval</span>
              <span className="text-sm text-gray-500">4 jam lalu</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Brand baru ditambahkan</span>
              <span className="text-sm text-gray-500">1 hari lalu</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Users className="h-6 w-6 text-pink-500 mr-2" />
            Informasi Sistem
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Status Server</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Database</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Upload Storage</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;