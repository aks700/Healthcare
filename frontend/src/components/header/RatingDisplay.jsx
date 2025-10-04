import React from 'react';
import { Star } from 'lucide-react';

const RatingDisplay = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-2">
        <img 
          src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1" 
          alt="User avatar" 
          className="w-8 h-8 rounded-full border-2 border-white"
        />
        <img 
          src="https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1" 
          alt="User avatar" 
          className="w-8 h-8 rounded-full border-2 border-white"
        />
        <img 
          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1" 
          alt="User avatar" 
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <span className="font-medium text-slate-700">4.9</span>
        <span className="text-slate-500">(5k reviews)</span>
      </div>
    </div>
  );
};

export default RatingDisplay;