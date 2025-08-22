import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import axios from 'axios';
import { apiEndpoints } from '../config/api';

function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(apiEndpoints.reviews);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiEndpoints.reviews, formData);
      setFormData({ customer_name: '', rating: 5, comment: '' });
      setShowForm(false);
      alert('Ulasan berhasil dikirim dan menunggu persetujuan admin');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Gagal mengirim ulasan');
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

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ulasan Pelanggan</h2>
          <p className="text-gray-600">Apa kata pelanggan tentang produk kami</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.slice(0, 6).map((review, index) => (
            <div
              key={review.id}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{review.customer_name}</h4>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          ))}
        </div>

        {/* Add Review Button */}
        <div className="text-center" data-aos="fade-up">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            {showForm ? 'Tutup Form' : 'Tulis Ulasan'}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="mt-8 max-w-md mx-auto" data-aos="fade-up">
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tulis Ulasan Anda</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>{rating} Bintang</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Komentar
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows="4"
                  className="w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  placeholder="Ceritakan pengalaman Anda..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Kirim Ulasan</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewSection;