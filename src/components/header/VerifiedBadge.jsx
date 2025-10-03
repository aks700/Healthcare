import React from 'react';
import { CheckCircle } from 'lucide-react';

const VerifiedBadge = () => {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
      <CheckCircle className="w-5 h-5 text-blue-600 fill-blue-100" />
      <span className="font-medium text-slate-700">Verified Doctors</span>
    </div>
  );
};

export default VerifiedBadge;