import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";

const MyRequests = ({ notifications }) => {
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/requests/requester/${user.id}`);
        setMyRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    if (user?.id) fetchMyRequests();
  }, [user?.id]);

  const filteredRequests = myRequests.filter((req) => {
    const searchLower = search.toLowerCase();
    return (
      req.task?.title?.toLowerCase().includes(searchLower) ||
      req.task?.category?.toLowerCase().includes(searchLower) ||
      req.task?.location?.toLowerCase().includes(searchLower) ||
      req.task_owner?.first_name?.toLowerCase().includes(searchLower) ||
      req.task_owner?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  const goToNotifications = () => navigate("/notification");

  return (
     <div
          className="flex flex-col bg-gray-900 text-white min-h-screen 
          w-full mt-16 md:mt-0 md:ml-64 md:w-[calc(100%-16rem)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-4 md:p-6 border-b border-gray-700">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Requests</h1>
              <p className="text-gray-400 text-sm md:text-base">
                Track the help requests you’ve sent
              </p>
            </div>
            <div className="relative cursor-pointer" onClick={goToNotifications}>
              <FaBell size={22} className="md:size-15" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            </div>
          </div>
    
          {/* Search & Add Task */}
          <div className="sticky top-[64px] md:top-[88px] z-20 bg-gray-900 px-4 py-3 md:px-6 md:py-4 border-b border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex items-center bg-white text-black px-3 md:px-4 py-2 rounded-lg w-full md:w-1/2">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full outline-none text-sm md:text-base"
                 value={search}
            onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/add-task" className="w-full md:w-auto">
              <button className="bg-blue-600 w-full md:w-auto text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                + Add New Task
              </button>
            </Link>
          </div>

      {/* Requests List */}
      <div className="px-4 sm:px-6 pb-10 mt-6 flex-1">
        {filteredRequests.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-gray-400 text-2xl font-semibold">No requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="flex flex-col bg-white text-black p-4 rounded-lg shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      {req.task_owner?.profile_picture ? (
                        <img
                          src={req.task_owner.profile_picture}
                          alt={`${req.task_owner.first_name} ${req.task_owner.last_name}`}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-2xl text-white font-bold rounded-full">
                          {`${req.task_owner?.first_name?.charAt(0) || ""}${req.task_owner?.last_name?.charAt(0) || ""}`.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{req.task?.title}</h2>
                      <p className="text-sm text-gray-600">
                        Task owner: {req.task_owner?.first_name} {req.task_owner?.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-sky-200 text-sky-700 text-xs font-semibold px-2 py-1 rounded">
                      {req.task?.category}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        req.status === "pending"
                          ? "bg-orange-200 text-orange-700"
                          : req.status === "accepted"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-200 p-3 rounded mt-3">
                  <p className="font-semibold">Task Information:</p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Description: </span>
                    {req.task?.description || "No description available."}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Location: </span>
                    {req.task?.location || "No location provided."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row text-sm text-gray-600 gap-2 sm:space-x-6 mt-2">
                  <span className="flex items-center">
                    <FaRegClock className="mr-2" /> Sent {new Date(req.createdAt).toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> {req.task?.location}
                  </span>
                </div>

                {req.task?.picture && (
                  <div className="mt-3">
                    <img
                      src={req.task.picture}
                      alt={req.task?.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
