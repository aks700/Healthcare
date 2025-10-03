import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

import { toast } from 'react-toastify'
import axios from 'axios'


const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, token, getDoctorsData } = useContext(AppContext)
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
  const [userAppointments, setUserAppointments] = useState([])
 

 
  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId)
    setDocInfo(docInfo)
  }

  // Fetch user's appointments with this doctor
  const fetchUserAppointments = async () => {
    if (!token) return
    try {
      const { data } = await axios.get( "/api/user/appointments", {
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

      const { data } = await axios.post( "/api/user/book-appointment",
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
    }
  }, [token, docId])

  return (
    docInfo && (
      <div className="px-4 py-6 max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50 min-h-screen">
        
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
              </div>
            </div>
          </div>
        </div>

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
      </div>
    )
  )
}

export default Appointment