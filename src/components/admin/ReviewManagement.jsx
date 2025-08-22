import { useState, useEffect } from 'react';
import { Check, X, Star, MessageSquare, Trash } from 'lucide-react';
import axios from 'axios';
import { apiEndpoints } from '../../config/api';

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiEndpoints.reviews}/admin`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${apiEndpoints.reviewById(id)}/approve`);
      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Gagal menyetujui ulasan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      try {
        await axios.delete(apiEndpoints.reviewById(id));
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Gagal menghapus ulasan');
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const pendingReviews = reviews.filter(review => !review.is_approved);
  const approvedReviews = reviews.filter(review => review.is_approved);

  return (
    <div>
      <div className="mb-8" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Ulasan</h1>
        <p className="text-gray-600 mt-2">Kelola ulasan pelanggan dan moderasi konten</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-aos="fade-up" data-aos-delay="100">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Ulasan</p>
              <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Menunggu Persetujuan</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingReviews.length}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Disetujui</p>
              <p className="text-2xl font-bold text-green-600">{approvedReviews.length}</p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4" data-aos="fade-up">
            Ulasan Menunggu Persetujuan ({pendingReviews.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingReviews.map((review, index) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{review.customer_name}</h3>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('id-ID')}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4" />
                      <span>Setuju</span>
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1"
                    >
                      <X className="h-4 w-4" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Reviews */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4" data-aos="fade-up">
          Ulasan Disetujui ({approvedReviews.length})
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {approvedReviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-400"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{review.customer_name}</h3>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('id-ID')}
                </p>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewManagement;