import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    password: "",

    profile_image: null, 
  });
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append("first_name", formData.first_name);
      dataToSend.append("last_name", formData.last_name);
      dataToSend.append("email_id", formData.email_id);
      dataToSend.append("phone_number", formData.phone_number);
      dataToSend.append("password", formData.password);

      
      if (formData.profile_image) {
        dataToSend.append("profile_image", formData.profile_image);
      } else {
        dataToSend.append("profile_image", "https://example.com/default-profile.png"); 
      }

      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: dataToSend,
      });

      const data = await res.json();

      if (data.success) {
        toast.info("OTP sent to your email!");
        navigate("/email", { state: { email: formData.email_id } });
      } else {
        toast.error(data.message || "Something went wrong!");
        console.log(data.error)
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error, try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-cyan-400 px-4 relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/90 rounded-xl shadow-xl">
            <span className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <p className="text-gray-700 font-semibold" role="status" aria-live="polite">Sending OTP...</p>
            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md mt-12">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm">Join Hire-a-Helper community</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
         
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">First name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your First name"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Last name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your Last name"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
            <input
              type="email"
              name="email_id"
              value={formData.email_id}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              maxLength="10"
              placeholder="Enter your Phone number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 transition ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={"/"} className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
