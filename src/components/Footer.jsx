import React from "react";
import { assets } from "../assets/assets";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side - Branding */}
        <div className="text-center md:text-left">
          <img className="w-40 mx-auto md:mx-0" src={assets.pmlogo} alt="Pulsemate Logo"></img>
          <p className="text-gray-600 mt-1 text-sm">
            © {new Date().getFullYear()} Health2X. All rights reserved.
          </p>
        </div>

        {/* Right Side - Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-gray-600">
          <a href="/about" className="hover:text-blue-600 transition">About Us</a>
          <a href="/specialties" className="hover:text-blue-600 transition">Specialties</a>
          <a href="/appointments" className="hover:text-blue-600 transition">Appointments</a>
          <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}
