import React from 'react';
import BookNowButton from './BookNowButton';
import SpecialtySelect from './SpecialtySelect';
import RatingDisplay from './RatingDisplay';
import VerifiedBadge from './VerifiedBadge';

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-gray-100 to-gray-400 w-full overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Column - Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
              Book Trusted Doctor Appointments Easily
            </h1>
            
            <BookNowButton />
{/*             
            <div className="w-full max-w-md">
              <SpecialtySelect />
            </div> */}
            
            <RatingDisplay />
            <div className="text-slate-600 text-lg md:text-xl mt-10">
              <p className='text-justify'> Discover trusted healthcare professionals with ease! Browse through our extensive list of top-rated doctors, specialists, and medical facilities. Schedule your appointment hassle-free, and take the first step towards prioritizing your health and well-being.</p>
            </div>
          </div>
          
          {/* Right Column - Doctor Image */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <img 
                src="https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg" 
                alt="Professional doctor" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                <VerifiedBadge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;