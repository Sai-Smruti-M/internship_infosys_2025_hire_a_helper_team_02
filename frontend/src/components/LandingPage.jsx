import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/images/landing_image.png)',
      }}
    >
      {/* Overlay visible only on mobile */}
      <div className="absolute inset-0 bg-black/50 sm:hidden"></div>

      <div className="bg-white/90 sm:bg-white/90 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl text-center relative z-10 max-sm:mx-4 max-sm:mt-6 max-sm:mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 sm:mb-4 max-sm:leading-snug">
          Welcome to <span className="text-cyan-500">Hire-a-Helper</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-sm:px-2">
          Connecting people who need help with those who can offer it.
          <br className="hidden sm:block" />
          Fast, secure, and easy!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/signup"
            className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold text-lg shadow-lg hover:opacity-90 active:scale-95 transition duration-300 max-sm:text-base max-sm:w-full"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl bg-white border border-indigo-500 text-indigo-600 font-semibold text-lg shadow-md hover:bg-indigo-50 active:scale-95 transition duration-300 max-sm:text-base max-sm:w-full"
          >
            Sign In
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-gray-200 text-sm text-center relative z-10 sm:text-gray-500 max-sm:text-gray-300 max-sm:mb-4">
        &copy; {new Date().getFullYear()} Hire-a-Helper Team 02. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
