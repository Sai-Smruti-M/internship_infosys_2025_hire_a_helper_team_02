import React, { useState, useEffect } from "react";
import { FaHome, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineOutbox } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  const profileLetter =
    (user?.first_name ? user.first_name.charAt(0).toUpperCase() : "") +
    (user?.last_name ? user.last_name.charAt(0).toUpperCase() : "");

  const navLinks = [
    { to: "/feed", icon: <FaHome size={20} />, label: "Feed" },
    { to: "/tasks", icon: <FaClipboardList size={20} />, label: "My Tasks" },
    { to: "/requests", icon: <FaFolderOpen size={20} />, label: "Requests" },
    { to: "/my-requests", icon: <MdOutlineOutbox size={20} />, label: "My Requests" },
    { to: "/add-task", icon: <FiPlus size={20} />, label: "Add Task" },
    { to: "/settings", icon: <IoMdSettings size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex-col p-4 border-r border-gray-700 transition-all">
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center mb-6">
          {user?.profile_image ? (
            <img
              src={user.profile_image}
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

        <nav className="flex flex-col space-y-2 flex-grow">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-lg transition ${
                  isActive ? "bg-teal-500" : "hover:bg-teal-500"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setShowLogoutPopup(true)}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-900 text-white flex items-center justify-between p-4 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white text-xl font-bold">
              {profileLetter}
            </div>
          )}
          <span className="font-semibold">{user ? user.first_name : "Guest"}</span>
        </div>

        <button onClick={() => setMenuOpen(true)}>
          <FaBars size={25} />
        </button>
      </div>

      {/* Mobile Floating Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-900 text-white z-50 flex flex-col transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes size={25} />
          </button>
        </div>

        <nav className="flex flex-col justify-center items-start flex-grow p-6 space-y-6">
          {navLinks.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 w-full rounded-lg transition ${
                  isActive ? "bg-teal-500" : "hover:bg-teal-500"
                }`
              }
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={() => {
              setMenuOpen(false);
              setShowLogoutPopup(true);
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100]">
          <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-2xl w-80 text-center">
            <h2 className="text-xl font-bold mb-3">Confirm Logout</h2>
            <p className="text-sm mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutPopup(false);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
