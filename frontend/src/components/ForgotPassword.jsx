import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); 
  const [email_id, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate=useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email_id) {
      toast.error("Email is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id, otp }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP verified! Set your new password.");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password updated successfully!");
        setStep(1);
        navigate("/") 
        setEmailId(""); setOtp(""); setPassword(""); setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-cyan-400 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Forgot Password</h2>
        <form className="mt-6 space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Email address</label>
                <input
                  type="email"
                  value={email_id}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSendOtp}
                className="w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:opacity-90 transition"
              >
                Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:opacity-90 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleResetPassword}
                className="w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:opacity-90 transition"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
