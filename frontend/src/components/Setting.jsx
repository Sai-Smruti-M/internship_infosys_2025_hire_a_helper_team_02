import React, { useState, useEffect } from 'react';
import { FaBell, FaCamera, FaTrash, FaKey } from "react-icons/fa";    
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Setting = ({ notifications }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    phone_number: '',
    profile_picture: '',
    bio: ''
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  // Load user info on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const profile_picture = storedUser.profile_image || storedUser.profile_picture || '';

    setForm({
      first_name: storedUser.first_name || '',
      last_name: storedUser.last_name || '',
      email_id: storedUser.email_id || '',
      phone_number: storedUser.phone_number || '',
      profile_picture,
      bio: storedUser.bio || ''
    });
  }, []); // Only run once on mount

  const userId = JSON.parse(localStorage.getItem("user"))?.id; // Get fresh userId

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = e => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  // Upload profile picture
  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const res = await axios.post(`http://localhost:5000/api/settings/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const newImage = res.data.profile_image;
        setForm(prev => ({ ...prev, profile_picture: newImage }));

        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = { ...storedUser, profile_image: newImage };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Profile picture updated!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error uploading profile picture');
    }
  };

  // Remove profile picture
  const handleRemovePicture = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/settings/remove-profile-picture/${userId}`);
      if (res.data.success) {
        setForm(prev => ({ ...prev, profile_picture: '' }));

        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = { ...storedUser, profile_image: '' };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Profile picture removed!');
      } else {
        toast.error(res.data.message || 'Failed to remove picture');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error removing profile picture');
    }
  };

  // Update user info
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email_id: form.email_id,
        phone_number: form.phone_number,
        bio: form.bio
      };

      const res = await axios.put(`http://localhost:5000/api/settings/${userId}`, payload);

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        const essentialUser = {
          id: res.data.user._id,
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
          email_id: res.data.user.email_id,
          phone_number: res.data.user.phone_number,
          profile_image: form.profile_picture,
          bio: res.data.user.bio
        };
        localStorage.setItem("user", JSON.stringify(essentialUser));
        setForm(prev => ({ ...prev, ...res.data.user, profile_picture: form.profile_picture }));
      } else {
        toast.error(res.data.message || "Error updating profile");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating profile");
    }
  };

  // Change password
  const handlePasswordSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/settings/change-password/${userId}`, passwordForm);
      if (res.data.success) {
        toast.success('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '' });
        setShowPasswordModal(false);
      } else {
        toast.error(res.data.message || 'Error changing password');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error changing password');
    }
  };

  const getInitials = () => {
    const first = form.first_name?.charAt(0).toUpperCase() || '';
    const last = form.last_name?.charAt(0).toUpperCase() || '';
    return first + last;
  };

  const goToNotifications = () => navigate("/notification");

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
        <form onSubmit={handleSubmit} className="bg-white text-black rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Profile Picture</h2>
          <div className="flex items-center gap-6 mb-8">
            {form.profile_picture ? (
              <img src={form.profile_picture} alt="Profile" className="w-20 h-20 rounded-full border object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-sky-500 text-white flex items-center justify-center text-2xl font-bold border">
                {getInitials()}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <label className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg cursor-pointer">
                <FaCamera size={18} /> Change Photo
                <input type="file" accept="image/*" onChange={handleProfilePicture} className="hidden" />
              </label>
              <button type="button" onClick={handleRemovePicture} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                <FaTrash size={18} /> Remove
              </button>
              <button type="button" onClick={() => setShowPasswordModal(true)} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                <FaKey size={18} /> Change Password
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold">First name</label>
              <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-semibold">Last name</label>
              <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold">Email Address</label>
              <input type="email" name="email_id" value={form.email_id} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-semibold">Phone Number</label>
              <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold">Bio <span className="text-gray-400">(Optional)</span></label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" className="w-full border rounded p-2" />
          </div>

          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg">
            Save Changes
          </button>
        </form>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border rounded p-2"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full border rounded p-2"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 border rounded hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
