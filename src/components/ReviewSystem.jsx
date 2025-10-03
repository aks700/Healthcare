import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ReviewSystem = ({ docId, appointmentId = null, externalTrigger = false, triggerReviewModal = null }) => {
  const { backendUrl, token } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [canReviewApp, setCanReviewApp] = useState(false);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    mode: 'add', // 'add' or 'edit'
    reviewId: null,
    initialRating: 5,
    initialReviewText: ''
  });

  const Modal = ({ isOpen, message, type, onClose }) => {
    if (!isOpen) return null;

    const modalStyles = {
      info: 'bg-blue-100 border-blue-500 text-blue-700',
      error: 'bg-red-100 border-red-500 text-red-700',
      success: 'bg-green-100 border-green-500 text-green-700'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`border-l-4 p-6 rounded-lg max-w-md w-full ${modalStyles[type]} shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Information'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReviewFormModal = ({ isOpen, mode, initialRating, initialReviewText, reviewId, onClose }) => {
    const [rating, setRating] = useState(initialRating);
    const [reviewText, setReviewText] = useState(initialReviewText);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (!token) {
        setReviewModal(prev => ({ ...prev, isOpen: false }));
        setModal({ show: true, message: 'Please login to submit a review', type: 'error' });
        return;
      }
      if (!reviewText.trim()) {
        setFormError('Please write a review');
        return;
      }
      if (rating < 1 || rating > 5) {
        setFormError('Please select a valid rating');
        return;
      }

      setIsSubmitting(true);
      try {
        const endpoint = mode === 'edit' ? '/api/review/update' : '/api/review/add';
        const payload = mode === 'edit' 
          ? { reviewId, rating, reviewText }
          : { appointmentId, rating, reviewText };

        const { data } = await axios({
          method: mode === 'edit' ? 'put' : 'post',
          url: `${backendUrl}${endpoint}`,
          data: payload,
          headers: { token }
        });

        if (data.success) {
          setModal({ show: true, message: data.message, type: 'success' });
          setReviewModal({ isOpen: false, mode: 'add', reviewId: null, initialRating: 5, initialReviewText: '' });
          setCanReviewApp(false);
          fetchReviews();
        } else {
          setFormError(data.message);
        }
      } catch (error) {
        console.error(`Error ${mode === 'edit' ? 'updating' : 'submitting'} review:`, error);
        setFormError(`Failed to ${mode === 'edit' ? 'update' : 'submit'} review`);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {mode === 'edit' ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating
              rating={rating}
              size="lg"
              interactive={true}
              onRatingChange={setRating}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Share your experience with this doctor..."
              maxLength="1000"
            />
            <p className="text-sm text-gray-500 mt-1">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {formError && (
            <p className="text-red-500 text-sm mb-4">{formError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {isSubmitting ? 'Submitting...' : mode === 'edit' ? 'Update Review' : 'Submit Review'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [modal, setModal] = useState({ show: false, message: '', type: 'info' });

  const fetchReviews = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/review/doctor`, { docId });
      if (data.success) {
        setReviews(data.reviews);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setModal({ show: true, message: 'Failed to fetch reviews', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    if (!appointmentId || !token) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/review/can-review`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        setCanReviewApp(data.canReview);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/review/helpful`, { reviewId });
      if (data.success) {
        toast.success('Marked as helpful');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error marking helpful:', error);
      toast.error('Failed to mark as helpful');
    }
  };

  const StarRating = ({ rating, size = 'sm', interactive = false, onRatingChange = null }) => {
    const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${
              interactive ? 'cursor-pointer hover:text-yellow-400' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const RatingDistribution = () => (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = statistics.ratingDistribution[rating] || 0;
        const percentage = statistics.totalReviews > 0 ? (count / statistics.totalReviews) * 100 : 0;
        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <span className="w-3 text-gray-600">{rating}</span>
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-gray-600">{count}</span>
          </div>
        );
      })}
    </div>
  );

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  useEffect(() => {
    if (docId) fetchReviews();
  }, [docId]);

  useEffect(() => {
    if (appointmentId && token) checkCanReview();
  }, [appointmentId, token]);

  useEffect(() => {
    if (externalTrigger && canReviewApp) {
      setReviewModal({
        isOpen: true,
        mode: 'add',
        reviewId: null,
        initialRating: 5,
        initialReviewText: ''
      });
    }
  }, [externalTrigger, canReviewApp]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8 relative">
      <Modal 
        isOpen={modal.show} 
        message={modal.message} 
        type={modal.type}
        onClose={() => setModal({ show: false, message: '', type: 'info' })}
      />
      
      <ReviewFormModal
        isOpen={reviewModal.isOpen}
        mode={reviewModal.mode}
        initialRating={reviewModal.initialRating}
        initialReviewText={reviewModal.initialReviewText}
        reviewId={reviewModal.reviewId}
        onClose={() => setReviewModal({ isOpen: false, mode: 'add', reviewId: null, initialRating: 5, initialReviewText: '' })}
      />

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Reviews & Ratings
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-800">
                {statistics.averageRating}
              </span>
              <div>
                <StarRating rating={Math.round(statistics.averageRating)} size="md" />
                <p className="text-sm text-gray-600 mt-1">
                  Based on {statistics.totalReviews} review{statistics.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <RatingDistribution />
          </div>
        </div>

        {canReviewApp && (
          <button
            onClick={() => setReviewModal({
              isOpen: true,
              mode: 'add',
              reviewId: null,
              initialRating: 5,
              initialReviewText: ''
            })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 text-lg">No reviews yet</p>
            <p className="text-gray-400 text-sm">Be the first to share your experience</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img
                  src={review.userImage}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-gray-800">{review.userName}</h5>
                    {review.isVerified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified Patient
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {review.reviewText}
                  </p>

                  {review.doctorResponse && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 pl-4 py-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-blue-800 text-sm">Doctor's Response</span>
                        <span className="text-xs text-blue-600">
                          {formatDate(review.doctorResponseDate)}
                        </span>
                      </div>
                      <p className="text-blue-800 text-sm">{review.doctorResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => markHelpful(review._id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Helpful ({review.isHelpful})
                    </button>
                    {triggerReviewModal && review.canEdit && (
                      <button
                        onClick={() => triggerReviewModal(review._id, review.rating, review.reviewText)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;