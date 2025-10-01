import React from "react";
import { FaHome, FaClipboardList } from "react-icons/fa";

import { MdOutlineOutbox } from "react-icons/md";

import { FaFolderOpen } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

 const handleLogout = () => {
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (!confirmed) return;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/", { replace: true });
};

  
  const profileLetter =
    (user?.first_name ? user.first_name.charAt(0).toUpperCase() : "") +
    (user?.last_name ? user.last_name.charAt(0).toUpperCase() : "");

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col p-4 border-r border-gray-700">
     
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center mb-6">
        {user?.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
            {profileLetter}
          </div>
        )}


        <h2 className="text-lg font-semibold text-gray-900">
          {user ? `${user.first_name} ${user.last_name}` : "Guest"}
        </h2>
        <p className="text-sm text-gray-900">
          {user ? user.email_id : "guest@example.com"}
        </p>
      </div>


      {/* Navigation */}
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-lg transition ${
              isActive ? "bg-teal-500" : "hover:bg-teal-500"
            }`
          }
        >
          <FaHome size={20} />
          <span>Feed</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-lg transition ${
              isActive ? "bg-teal-500" : "hover:bg-teal-500"
            }`
          }
        >
          <FaClipboardList size={20} />
          <span>My Tasks</span>
        </NavLink>

        <NavLink
          to="/requests"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-lg transition ${
              isActive ? "bg-teal-500" : "hover:bg-teal-500"
            }`
          }
        >
          <FaFolderOpen size={20} />
          <span>Requests</span>
        </NavLink>

        <NavLink
          to="/my-requests"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-lg transition ${
              isActive ? "bg-teal-500" : "hover:bg-teal-500"
            }`
          }
        >

          <MdOutlineOutbox size={20} />

          <span>My Requests</span>
        </NavLink>

        <NavLink
          to="/add-task"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-lg transition ${
              isActive ? "bg-teal-500" : "hover:bg-teal-500"
            }`
          }
        >
          <FiPlus size={20} />
          <span>Add Task</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-lg transition ${
              isActive ? "bg-teal-500" : "hover:bg-teal-500"
            }`
          }

        >
          <IoMdSettings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

     
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
