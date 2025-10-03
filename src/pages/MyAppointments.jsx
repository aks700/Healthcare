import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';


const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);


  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/cancel-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ appointmentId })
      });
      const data = await response.json();
      
      if (data.success) {
        getUserAppointments();
        getDoctorsData();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No appointments found.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-300 hover:shadow-lg">
              {/* Doctor Image */}
              <img src={item.docData.image} alt="doctor" className="w-24 h-24 object-cover rounded-full border" />

              {/* Info */}
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">{item.docData.name}</h3>
                <p className="text-sm text-gray-500">{item.docData.speciality}</p>
                <p className="text-sm text-gray-500">Experience: {item.docData.experience}</p>
                <p className="text-sm text-gray-500">Address: {item.docData.address.line1}, {item.docData.address.line2}</p>
                <p className="text-sm font-medium text-blue-600">Date & Time: {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-4 sm:mt-0 sm:ml-auto">
                {canStartVideoCall(item) && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition flex items-center gap-2"
                  >
                    <span>📹</span> Start Video Call
                  </button>
                )}

                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="py-2 px-4 rounded bg-green-100 text-green-700 border border-green-200 cursor-default">Paid</button>
                )}

                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-600 hover:text-white transition"
                  >
                    Pay Online
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-600 hover:text-white transition"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;