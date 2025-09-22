import React, { useState, useEffect } from 'react'
import { FaBell } from "react-icons/fa";      
import { FaCamera } from "react-icons/fa";    
import { FaTrash } from "react-icons/fa";     
import { FaKey } from "react-icons/fa";    

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Setting = ({ notifications }) => {
  const navigate=useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    phone_number: '',
    profile_picture: ''
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/settings/${userId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email_id: data.email_id || '',
          phone_number: data.phone_number || '',
          profile_picture: data.profile_picture || '',
          bio: data.bio || ''
        });
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        toast.error("Failed to load profile");
      });
  }, [userId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/settings/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        toast.success("Profile updated successfully!");
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email_id: data.email_id || '',
          phone_number: data.phone_number || '',
          profile_picture: data.profile_picture || '',
          bio: data.bio || ''
        });

        const updatedUser = {
          ...storedUser,
          first_name: data.first_name,
          last_name: data.last_name,
          email_id: data.email_id,
          phone_number: data.phone_number,
          profile_picture: data.profile_picture,
          bio: data.bio
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch(err => {
        console.error('Update error:', err);
        toast.error("Error updating profile");
      });
  };

  const getInitials = () => {
    const first = form.first_name?.charAt(0).toUpperCase() || '';
    const last = form.last_name?.charAt(0).toUpperCase() || '';
    return first + last;
  };

  const goToNotifications = () => {
    navigate("/notification");
  };

  return (
    <div className="ml-64 flex flex-col w-[calc(100%-16rem)] bg-gray-900 text-white min-h-screen border-l border-gray-700">
      
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-6 border-b border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400">Manage your profile and account preferences</p>
        </div>

        <div className="relative" onClick={goToNotifications}>
          <FaBell size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {notifications.length}

          </span>
        </div>
      </div>

     
      <div className="flex justify-center mt-10 px-6 pb-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black rounded-xl shadow-lg p-8 w-full max-w-2xl"
        >
          
          <h2 className="text-2xl font-bold mb-6">Profile Picture</h2>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-sky-500 text-white flex items-center justify-center text-2xl font-bold border">
              {getInitials()}
            </div>
            <div className="flex gap-3 flex-wrap">
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg">
                <FaCamera size={18} /> Change Photo
              </button>
              <button type="button" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                <FaTrash size={18} /> Remove
              </button>
              <button type="button" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                <FaKey size={18} /> Change Password
              </button>
            </div>
          </div>

          
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold">First name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />

            </div>
            <div>
              <label className="block font-semibold">Last name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold">Email Address</label>
              <input
                type="email"
                name="email_id"
                value={form.email_id}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold">
              Bio <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default Setting
