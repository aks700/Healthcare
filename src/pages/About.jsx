import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-800 px-4 sm:px-10 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">About Our Doctor Booking Platform</h1>
        <p className="text-gray-600 text-lg">
          We connect patients with trusted healthcare professionals for accessible, reliable, and affordable care — anytime, anywhere.
        </p>
      </div>

      {/* Mission and Vision */}
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto mb-20">
        <img
          src={assets.about_image}
          alt="Our Mission"
          className="rounded-xl shadow-xl"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            Our mission is to simplify and modernize healthcare access. We empower patients with a user-friendly platform to find verified doctors, book appointments seamlessly, and receive quality consultations — from the comfort of their home.
          </p>
          <p className="text-gray-600">
            By bridging the gap between care providers and seekers, we reduce waiting times, eliminate guesswork, and build a healthcare experience centered on trust, transparency, and convenience.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-20">
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-slate-800">Our Vision</h2>
          <p className="text-gray-600 text-lg">
            To become the go-to digital healthcare companion for millions — where personalized care meets cutting-edge technology to ensure no one is left behind when it comes to health and well-being.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-slate-800">Why Choose Us?</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { title: 'Verified Doctors', desc: 'All listed professionals are background-verified and hold valid licenses.' },
            { title: 'Effortless Booking', desc: 'Book appointments instantly with live availability and reminders.' },
            { title: 'Transparent Pricing', desc: 'No hidden costs. Know what you pay for, every step of the way.' },
            { title: 'Secure & Private', desc: 'Bank-grade encryption ensures your health records are always safe.' },
            { title: '24/7 Access', desc: 'Healthcare on your schedule — day or night, weekday or weekend.' },
            { title: 'Community Reviews', desc: 'Read honest experiences from real patients before you decide.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-all text-left">
              <h3 className="text-xl font-semibold mb-2 text-slate-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Callout */}
      <div className="bg-slate-900 text-white mt-20 p-10 rounded-xl max-w-5xl mx-auto text-center shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Ready to take control of your health journey?</h3>
        <p className="mb-6 text-gray-200 text-lg">
          Whether you need a routine check-up or a specialized consultation, our platform helps you find the right doctor, at the right time, in just a few clicks.
        </p>
        <button
          onClick={() => navigate('/doctors')}
          className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-medium px-8 py-3 rounded-full transition"
        >
          Browse Doctors
        </button>
      </div>
    </div>
  );
};

export default About;
