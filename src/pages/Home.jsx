import React, { useEffect, useState } from 'react'
import Header from '../components/header/Header';



import Faq from '../components/Faq';
import BookingStep from '../components/BookingStep';
import HomeReviews from '../components/HomeReviews';
import Hero from '../components/Hero';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Home = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <Hero />

      <main className="container mx-auto px-4 py-8">
        {/* Main content will go here */}
        <div className="text-center text-gray-500 mt-8">
          <p>Scroll down to explore our services</p>
        </div>
      </main>
      <div>
        <BookingStep />
        <HomeReviews />
        <Faq />
      </div>
    </div>

  )
}

export default Home