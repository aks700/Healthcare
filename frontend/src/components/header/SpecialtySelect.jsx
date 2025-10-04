import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Family Medicine',
  'Gastroenterology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
];

const SpecialtySelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const handleSelect = (specialty) => {
    setSelectedSpecialty(specialty);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <label htmlFor="specialty" className="block text-sm font-medium text-slate-600 mb-1 ml-1">
        Select a specialty
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-full cursor-pointer shadow-sm"
      >
        <span className={`${selectedSpecialty ? 'text-slate-800' : 'text-slate-400'}`}>
          {selectedSpecialty || 'Select a specialty'}
        </span>
        <ChevronDown size={20} className="text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1">
            {SPECIALTIES.map((specialty) => (
              <li
                key={specialty}
                onClick={() => handleSelect(specialty)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-slate-700 hover:text-blue-600"
              >
                {specialty}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpecialtySelect;