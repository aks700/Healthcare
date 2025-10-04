import React from 'react';
import { FaSearch, FaUserMd, FaCalendarCheck, FaSmile } from 'react-icons/fa';

const steps = [
  {
    icon: <FaSearch className="text-3xl text-blue-600" />,
    title: "Search for Doctors",
    description: "Find doctors by specialization, location, and availability."
  },
  {
    icon: <FaUserMd className="text-3xl text-green-600" />,
    title: "View Profiles",
    description: "Compare qualifications, experience, and patient reviews."
  },
  {
    icon: <FaCalendarCheck className="text-3xl text-purple-600" />,
    title: "Book Appointment",
    description: "Choose your preferred time slot and confirm instantly."
  },
  {
    icon: <FaSmile className="text-3xl text-yellow-500" />,
    title: "Get Treated",
    description: "Visit the doctor or consult online from home."
  },
];

const BookingStep = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 md:px-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer text-center p-6 bg-white rounded-2xl shadow hover:shadow-md hover:scale-105 transition duration-300"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookingStep;
