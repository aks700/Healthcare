import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
    }
    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
    }
  };

  return (
    <div className="flex justify-between items-center bg-white px-4 sm:px-10 py-3 border-b shadow-md">
      <div className="flex items-center gap-3">
        <img
          className="w-36 sm:w-44 cursor-pointer"
          src={assets.pmlogo}
          alt="admin_logo"
        />
        <span className="border px-3 py-0.5 rounded-full border-gray-400 text-xs text-gray-600">
          {aToken ? 'Admin' : 'Doctor'}
        </span>
      </div>

      <button
        onClick={logout}
        className="bg-slate-900 text-white text-sm px-6 sm:px-10 py-2 rounded-full hover:bg-slate-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
