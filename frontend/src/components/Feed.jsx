import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";


import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Feed = ({notifications}) => {


  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); 

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendRequest = async (task) => {
    if (!user) {
      alert("You must be logged in to send a request!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: task._id,
          requester_id: user.id,
          task_owner_id: task.user_id._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Request sent successfully!");
        setTasks((prev) =>
          prev.map((t) =>
            t._id === task._id ? { ...t, is_request_sent: true } : t
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  
  const goToNotifications = () => {
    navigate("/notification");
  };

  return (
    <div className="ml-64 flex flex-col w-[calc(100%-16rem)] bg-gray-900 text-white min-h-screen">
      
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-6 border-b border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Feed</h1>
          <p className="text-gray-400">Find Tasks that need help</p>
        </div>
        <div className="relative cursor-pointer" onClick={goToNotifications}>
          <FaBell size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
      </div>

      <div className="sticky top-[88px] z-20 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-1/2">
          <FaSearch className="text-gray-500 mr-2" />
          <input type="text" placeholder="Search tasks..." className="w-full outline-none" />
        </div>
        <Link to="/add-task">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-4">+ Add New Task</button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tasks.map((task) => {
            const userInfo = task.user_id;
            const isButtonDisabled = task.is_request_sent === true;

            return (
              <div key={task._id} className="bg-white text-black rounded-lg shadow-md overflow-hidden">
                <img
                  src={task.picture ? `http://localhost:5000${task.picture}` : "https://via.placeholder.com/300x200"}
                  alt={task.title || "Task"}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">{task.category || "General"}</span>
                    <span className="text-gray-500 text-sm">{task.start_time ? new Date(task.start_time).toLocaleDateString() : "No date"}</span>
                  </div>
                  <h2 className="font-semibold text-lg mb-1">{task.title || "Untitled Task"}</h2>
                  <p className="text-gray-600 text-sm mb-3">{task.description || "No description available"}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-1"><FaMapMarkerAlt className="mr-2" />{task.location || "No location"}</div>
                  <div className="flex items-center text-gray-500 text-sm mb-3"><FaRegClock className="mr-2" />{task.start_time ? new Date(task.start_time).toLocaleTimeString() : "No start time"}{task.end_time && ` - ${new Date(task.end_time).toLocaleTimeString()}`}</div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {userInfo?.profile_picture ? (
                        <img src={`http://localhost:5000${userInfo.profile_picture}`} alt={`${userInfo.first_name}`} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{userInfo?.first_name?.[0] || "?"}</span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-gray-700">{userInfo?.first_name} {userInfo?.last_name}</span>
                        <span className="text-gray-500 text-xs">{userInfo?.email_id}</span>
                      </div>
                    </div>
                    <button
                      className={`px-3 py-1 rounded-lg text-sm ${isButtonDisabled ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-400 text-white"}`}
                      disabled={isButtonDisabled}
                      onClick={() => handleSendRequest(task)}
                    >
                      {isButtonDisabled ? "Request Sent" : "Request Send"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Feed;
