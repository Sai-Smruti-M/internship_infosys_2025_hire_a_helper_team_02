import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MyTasks = ({ notifications }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState(""); 
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/my-tasks/${storedUser.id}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    if (storedUser?.id) fetchTasks();
  }, [storedUser]);

  const goToNotifications = () => navigate("/notification");

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/my-tasks/${taskId}?user_id=${storedUser.id}`
      );
      if (res.data.success) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
        toast.success("Task deleted");
      } else {
        toast.error(res.data.message || "Failed to delete task");
      }
    } catch (err) {
      console.error("Delete task error:", err);
      toast.error("Server error deleting task");
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase()) ||
      task.location?.toLowerCase().includes(search.toLowerCase()) ||
      task.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="flex flex-col bg-gray-900 text-white min-h-screen 
      w-full mt-16 md:mt-0 md:ml-64 md:w-[calc(100%-16rem)]"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-4 md:p-6 border-b border-gray-700">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Manage your posted tasks
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
      <div className="sticky top-[88px] z-20 bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 gap-3">
        <div className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-full sm:w-1/2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm sm:text-base"
          />
        </div>

        <Link to="/add-task" className="w-full sm:w-auto mt-2 sm:mt-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-blue-700 transition">
            + Add New Task
          </button>
        </Link>
      </div>

      {/* Task Cards */}
      <div className="px-4 sm:px-6 pb-10 space-y-4 mt-6">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center">No tasks found for your search.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col sm:flex-row bg-gray-800 p-4 rounded-lg shadow-md items-start sm:items-center gap-4"
            >
              <img
                src={task.picture || "https://via.placeholder.com/80"}
                alt={task.title}
                className="w-full sm:w-20 h-40 sm:h-20 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{task.title}</h2>
                  <p className="text-gray-300 mb-2 line-clamp-3">{task.description}</p>

                  <div className="flex flex-col sm:flex-row text-sm text-gray-400 gap-2 sm:gap-4 mb-2">
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      {task.location || "No location"}
                    </span>
                    <span className="flex items-center">
                      <FaRegClock className="mr-2 text-gray-500" />
                      {task.start_time ? new Date(task.start_time).toLocaleString() : "N/A"} 
                      - {task.end_time ? new Date(task.end_time).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Status + Delete Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-center w-full sm:w-auto ${
                      task.status === "pending"
                        ? "bg-yellow-400 text-black"
                        : task.status === "completed"
                        ? "bg-green-500 text-black"
                        : "bg-blue-400 text-black"
                    }`}
                  >
                    {task.status}
                  </span>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTasks;
