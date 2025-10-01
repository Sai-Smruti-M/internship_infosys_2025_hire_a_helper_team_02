import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4" style={{ backgroundImage: 'url(/images/landing_image.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'top center' }}>
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center mt-64 relative z-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to Hire-a-Helper</h1>
        <p className="text-lg text-gray-600 mb-8">
          Connecting people who need help with those who can offer it. Fast, secure, and easy!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-bold text-lg shadow hover:opacity-90 transition">
            Get Started
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-lg bg-white border border-indigo-500 text-indigo-600 font-bold text-lg shadow hover:bg-indigo-50 transition">
            Sign In
          </Link>
        </div>
      </div>
      <footer className="mt-8 text-gray-200 text-sm text-center relative z-10">
        &copy; {new Date().getFullYear()} Hire-a-Helper Team 02. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
