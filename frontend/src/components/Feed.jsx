import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Feed = ({ notifications, refreshNotifications }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingTaskId, setLoadingTaskId] = useState(null); // 🔹 Added
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

    setLoadingTaskId(task._id); // 🔹 Start loading

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

      refreshNotifications();
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
    } finally {
      setLoadingTaskId(null); // 🔹 Stop loading
    }
  };

  const goToNotifications = () => navigate("/notification");

  const filteredTasks = tasks
    .filter((task) => task.user_id?._id !== user?.id)
    .filter(
      (task) =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div
      className="flex flex-col bg-gray-900 text-white min-h-screen 
      w-full mt-16 md:mt-0 md:ml-64 md:w-[calc(100%-16rem)]"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-4 md:p-6 border-b border-gray-700">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Feed</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Find Tasks that need help
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/add-task" className="w-full md:w-auto">
          <button className="bg-blue-600 w-full md:w-auto text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add New Task
          </button>
        </Link>
      </div>

      {/* Feed Cards */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm:mt-10 md:mt-6">
          {filteredTasks.map((task) => {
            const userInfo = task.user_id;
            const isButtonDisabled = task.is_request_sent === true;
            const isLoading = loadingTaskId === task._id; // 🔹 Check loading for each task

            return (
              <div
                key={task._id}
                className="bg-white text-black rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={task.picture || "https://via.placeholder.com/300x200"}
                  alt={task.title || "Task"}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">
                        {task.category || "General"}
                      </span>
                      <span className="text-gray-500 text-xs md:text-sm">
                        {task.start_time
                          ? new Date(task.start_time).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                    <h2 className="font-semibold text-base md:text-lg mb-1">
                      {task.title || "Untitled Task"}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {task.description || "No description available"}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <FaMapMarkerAlt className="mr-2" />
                      {task.location || "No location"}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <FaRegClock className="mr-2" />
                      {task.start_time
                        ? new Date(task.start_time).toLocaleTimeString()
                        : "No start time"}
                      {task.end_time &&
                        ` - ${new Date(task.end_time).toLocaleTimeString()}`}
                    </div>
                  </div>

                  {/* Profile + Button Section */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mt-3">
                    <div className="flex items-center space-x-3">
                      {userInfo?.profile_picture ? (
                        <img
                          src={userInfo.profile_picture}
                          alt={`${userInfo.first_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">
                            {userInfo?.first_name?.[0] || "?"}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-gray-700 text-sm sm:text-base">
                          {userInfo?.first_name} {userInfo?.last_name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {userInfo?.email_id}
                        </span>
                      </div>
                    </div>

                    {/* ✅ Request Button with Loading */}
                    <button
                      className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isButtonDisabled
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : isLoading
                          ? "bg-yellow-500 text-white cursor-wait"
                          : "bg-green-400 hover:bg-green-500 text-white"
                      }`}
                      disabled={isButtonDisabled || isLoading}
                      onClick={() => handleSendRequest(task)}
                    >
                      {isLoading
                        ? "Sending..."
                        : isButtonDisabled
                        ? "Request Sent"
                        : "Request Send"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No tasks found. Try adjusting your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;
