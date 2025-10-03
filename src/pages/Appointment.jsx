import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

import { toast } from 'react-toastify'
import axios from 'axios'
import ReviewSystem from '../components/ReviewSystem'
import RatingDisplay from '../components/RatingDisplay'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const navigate = useNavigate()
  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [userReviews, setUserReviews] = useState([])
  const [userAppointments, setUserAppointments] = useState([])
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })
  const [loading, setLoading] = useState(false)
  const [externalTrigger, setExternalTrigger] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  
  // Modal states
  const [editReviewModal, setEditReviewModal] = useState({
    isOpen: false,
    reviewId: null,
    rating: 5,
    reviewText: ''
  });
  
  const [deleteReviewModal, setDeleteReviewModal] = useState({
    isOpen: false,
    reviewId: null,
    reviewText: ''
  });

  // Edit Review Modal Component
  const EditReviewModal = ({ isOpen, reviewId, initialRating, initialText, onClose, onSave }) => {
    const [rating, setRating] = useState(initialRating);
    const [reviewText, setReviewText] = useState(initialText);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      if (isOpen) {
        setRating(initialRating);
        setReviewText(initialText);
        setError('');
      }
    }, [isOpen, initialRating, initialText]);

    const handleSave = async () => {
      if (!reviewText.trim()) {
        setError('Please write a review');
        return;
      }

      setIsSubmitting(true);
      try {
        await updateReview(reviewId, rating, reviewText);
        onSave();
        onClose();
      } catch (error) {
        setError('Failed to update review');
      } finally {
        setIsSubmitting(false);
      }
    };

    const StarRating = ({ rating, onRatingChange }) => (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => onRatingChange(star)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-gray-900">Edit Your Review</h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Update your rating
              </label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Update your review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="5"
                placeholder="Update your experience..."
                maxLength="1000"
              />
              <p className="text-xs text-gray-500 mt-2">
                {reviewText.length}/1000 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !reviewText.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Updating...' : 'Update Review'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = ({ isOpen, reviewText, onConfirm, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
      setIsDeleting(true);
      try {
        await onConfirm();
      } finally {
        setIsDeleting(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Delete Review</h3>
              <p className="text-gray-600 text-sm mb-4">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              
              {reviewText && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700 italic">
                    "{reviewText.length > 100 ? reviewText.substring(0, 100) + '...' : reviewText}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Keep Review
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isDeleting ? 'Deleting...' : 'Delete Review'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId)
    setDocInfo(docInfo)
  }

  // Fetch user's appointments with this doctor
  const fetchUserAppointments = async () => {
    if (!token) return
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token }
      })
      if (data.success) {
        // Filter appointments for current doctor
        const doctorAppointments = data.appointments.filter(apt => apt.docId === docId)
        setUserAppointments(doctorAppointments)
      }
    } catch (error) {
      console.error('Error fetching user appointments:', error)
    }
  }

  // Fetch user's reviews for this doctor
  const fetchUserReviews = async () => {
    if (!token) return
    try {
      const { data } = await axios.get(backendUrl + "/api/review/user", {
        headers: { token }
      })
      if (data.success) {
        // Filter reviews for current doctor
        const doctorReviews = data.reviews.filter(review => review.docId === docId)
        setUserReviews(doctorReviews)
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error)
    }
  }

  // Delete a review - Updated to use modal confirmation
  const deleteReview = async (reviewId) => {
    try {
      setLoading(true)
      const { data } = await axios.delete(backendUrl + "/api/review/delete", {
        data: { reviewId },
        headers: { token }
      })

      if (data.success) {
        toast.success(data.message)
        fetchUserReviews()
        // Trigger refresh of ReviewSystem component
        window.location.reload()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update a review - Updated to work with modal
  const updateReview = async (reviewId, rating, reviewText) => {
    try {
      setLoading(true)
      const { data } = await axios.put(backendUrl + "/api/review/update", {
        reviewId,
        rating,
        reviewText
      }, {
        headers: { token }
      })

      if (data.success) {
        toast.success(data.message)
        fetchUserReviews()
        // Trigger refresh of ReviewSystem component
        window.location.reload()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error('Failed to update review')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Handle edit review - Open modal instead of prompt
  const handleEditReview = (reviewId, rating, reviewText) => {
    setEditReviewModal({
      isOpen: true,
      reviewId,
      rating,
      reviewText
    });
  }

  // Handle delete review - Open modal instead of confirm
  const handleDeleteReview = (reviewId, reviewText) => {
    setDeleteReviewModal({
      isOpen: true,
      reviewId,
      reviewText
    });
  }

  const getAvailableSlots = async () => {
    setDocSlots([])
    const today = new Date()

    for (let i = 1; i <= 90; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i) // Start from tomorrow

      const startTime = new Date(currentDate)
      startTime.setHours(10, 0, 0, 0) // 10 AM

      const endTime = new Date(currentDate)
      endTime.setHours(16, 0, 0, 0) // 4 PM

      const timeSlots = []
      while (startTime < endTime) {
        const formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        const date = new Date(startTime)

        let day = date.getDate().toString().padStart(2, '0')
        let month = (date.getMonth() + 1).toString().padStart(2, '0')
        let year = date.getFullYear()

        const slotDate = `${day}_${month}_${year}`
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(startTime),
            time: formattedTime,
          })
        }
        startTime.setMinutes(startTime.getMinutes() + 30)
      }

      setDocSlots((prev) => [...prev, timeSlots])
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Log in to book appointments")
      return navigate("/login")
    }

    try {
      if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
        toast.error("No slots available for the selected date")
        return
      }

      if (!slotTime) {
        toast.warn("Please select a time slot")
        return
      }

      const date = docSlots[slotIndex][0].dateTime

      let day = date.getDate().toString().padStart(2, '0')
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let year = date.getFullYear()

      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate("/my-appointments")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Booking failed")
    }
  }

  // Function to get Google Maps embed URL
  const getGoogleMapsEmbedUrl = (address) => {
    const encodedAddress = encodeURIComponent(`${address.line1}, ${address.line2}`)
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`
  }

  // Function to open Google Maps in new tab
  const openInGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(`${address.line1}, ${address.line2}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  // Function to get directions
  const getDirections = (address) => {
    const encodedAddress = encodeURIComponent(`${address.line1}, ${address.line2}`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank')
  }

  // Format date helper
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get completed appointments that can be reviewed
  const getReviewableAppointments = () => {
    return userAppointments.filter(apt =>
      apt.isCompleted &&
      !apt.cancelled &&
      !userReviews.some(review => review.appointmentId === apt._id)
    )
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  useEffect(() => {
    if (token && docId) {
      fetchUserAppointments()
      fetchUserReviews()
    }
  }, [token, docId])

  return (
    docInfo && (
      <div className="px-4 py-6 max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50 min-h-screen">
        {/* Modals */}
        <EditReviewModal
          isOpen={editReviewModal.isOpen}
          reviewId={editReviewModal.reviewId}
          initialRating={editReviewModal.rating}
          initialText={editReviewModal.reviewText}
          onClose={() => setEditReviewModal({ isOpen: false, reviewId: null, rating: 5, reviewText: '' })}
          onSave={() => {
            fetchUserReviews();
            setEditReviewModal({ isOpen: false, reviewId: null, rating: 5, reviewText: '' });
          }}
        />

        <DeleteConfirmationModal
          isOpen={deleteReviewModal.isOpen}
          reviewText={deleteReviewModal.reviewText}
          onConfirm={async () => {
            await deleteReview(deleteReviewModal.reviewId);
            setDeleteReviewModal({ isOpen: false, reviewId: null, reviewText: '' });
          }}
          onClose={() => setDeleteReviewModal({ isOpen: false, reviewId: null, reviewText: '' })}
        />

        {/* Doctor Info */}
        <div className="flex flex-col sm:flex-row gap-6 items-start bg-white shadow-xl rounded-3xl p-6 sm:p-10 relative">
          <img
            className="rounded-2xl w-full sm:w-72 object-cover shadow-lg"
            src={docInfo.image}
            alt="Doctor"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </div>

            {/* Rating Display */}
            <div className="flex items-center gap-4">
              <RatingDisplay
                rating={docInfo.averageRating || 0}
                totalReviews={docInfo.totalReviews || 0}
                size="md"
              />
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <span className="px-2 py-0.5 text-xs border border-gray-300 rounded-full">
                {docInfo.experience}
              </span>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                About <img src={assets.info_icon} alt="Info" />
              </p>
              <p className="text-sm text-gray-600 mt-1">{docInfo.about}</p>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              Appointment Fee:{' '}
              <span className="text-gray-900 font-semibold">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>

            {/* Enhanced Address Section with Map Options */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Clinic Address
                  </p>
                  <p className="text-sm text-gray-600">{docInfo.address.line1}</p>
                  <p className="text-sm text-gray-600">{docInfo.address.line2}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {showMap ? 'Hide Map' : 'Show Map'}
                  </button>
                  <button
                    onClick={() => openInGoogleMaps(docInfo.address)}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                  >
                    Open in Maps
                  </button>
                  <button
                    onClick={() => getDirections(docInfo.address)}
                    className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              </div>

              {/* Embedded Map */}
              {showMap && (
                <div className="mt-4">
                  <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm text-blue-700 font-medium">Map View</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {docInfo.address.line1}<br />
                          {docInfo.address.line2}
                        </p>
                        <p className="text-xs text-blue-500 mt-2">
                          Click "Open in Maps" for full map experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User's Previous Reviews Section */}
        {token && userReviews.length > 0 && (
          <div className="mt-10 bg-white rounded-3xl shadow-lg p-6 sm:p-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Your Reviews for Dr. {docInfo.name}
            </h3>

            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <RatingDisplay rating={review.rating} size="sm" showText={false} />
                      <p className="text-sm text-gray-500 mt-1">
                        Reviewed on {formatDate(review.date)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditReview(review._id, review.rating, review.reviewText)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        disabled={loading}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteReview(review._id, review.reviewText)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.reviewText}
                  </p>

                  {/* Doctor Response */}
                  {review.doctorResponse && (
                    <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 pl-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviewable Appointments Section */}
        {token && getReviewableAppointments().length > 0 && (
          <div className="mt-10 bg-white rounded-3xl shadow-lg p-6 sm:p-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Appointments Ready for Review
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {getReviewableAppointments().map((appointment) => (
                <div key={appointment._id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {slotDateFormat(appointment.slotDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        at {appointment.slotTime}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAppointmentId(appointment._id)
                      setExternalTrigger(true)
                    }}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Write Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Section */}
        <div className="mt-10 bg-white rounded-3xl shadow-lg p-6 sm:p-10">
          <p className="text-lg font-semibold text-gray-800 mb-4">Booking Slots</p>

          {/* Date Slots */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center px-4 py-3 rounded-2xl cursor-pointer shadow-md min-w-20 transition-all duration-200 ${slotIndex === index
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <p className="font-medium">{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p className="text-sm pt-1">
                    {item[0] &&
                      `${item[0].dateTime.getDate()} ${item[0].dateTime.toLocaleString('default', { month: 'short' })}`}
                  </p>
                </div>
              ))}
          </div>

          {/* Time Slots */}
          <div className="flex flex-wrap gap-3 mt-6">
            {docSlots.length > 0 &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-medium px-5 py-2 rounded-full cursor-pointer border transition-all duration-200 ${item.time === slotTime
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-gray-500 bg-gray-50 hover:bg-gray-100 border-gray-300'
                    }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          {/* Book Button */}
          <div className="mt-8 text-center">
            <button onClick={bookAppointment} className="bg-black text-white px-10 py-3 rounded-full text-sm font-medium shadow-lg hover:bg-gray-800 transition-all">
              Book an Appointment
            </button>
          </div>
        </div>

        {/* Review System Component with dynamic appointment ID */}
        <ReviewSystem
          docId={docId}
          appointmentId={selectedAppointmentId}
          externalTrigger={externalTrigger}
        />
      </div>
    )
  )
}

export default Appointment