import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import DashboardHome from '../components/admin/DashboardHome';
import ProductManagement from '../components/admin/ProductManagement';
import BrandManagement from '../components/admin/BrandManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import ReviewManagement from '../components/admin/ReviewManagement';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/brands" element={<BrandManagement />} />
        <Route path="/categories" element={<CategoryManagement />} />
        <Route path="/reviews" element={<ReviewManagement />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminDashboard;