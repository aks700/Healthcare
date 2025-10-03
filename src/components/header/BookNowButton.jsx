import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookNowButton = () => {
  const navigate= useNavigate();
  return (
    <a  href='#speciality'
      className="bg-slate-800 hover:bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg max-w-xs"
    >
      <span className="text-lg">Book Now</span>
      <ArrowRight size={20} />
    </a>
  );
};

export default BookNowButton;