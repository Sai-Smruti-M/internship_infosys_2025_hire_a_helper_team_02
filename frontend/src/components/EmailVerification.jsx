import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Email verified & account created!");
        navigate("/");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error, try again!");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: email }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Could not resend OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-cyan-400 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
            alt="verify-email"
            className="w-20 h-20"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800">Verify your E-mail</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter the 4-digit code sent to your email ({email})
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Verification code
          </label>
          <input
            type="text"
            maxLength="4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mx-auto block w-40 text-center border border-gray-300 rounded-md px-3 py-2 text-lg tracking-widest focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="----"
            required
          />

          <button
            type="submit"
            className="mt-6 w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:opacity-90 transition"
          >
            Verify code
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Didn’t receive the code?{" "}
          <button onClick={handleResend} className="text-blue-600 font-medium hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
