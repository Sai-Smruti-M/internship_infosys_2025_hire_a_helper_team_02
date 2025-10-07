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
    <div className="ml-64 flex flex-col w-[calc(100%-16rem)] bg-gray-900 text-white min-h-screen border-l border-gray-700">
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-6 border-b border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-400">Manage your posted tasks</p>
        </div>
        <div className="relative cursor-pointer" onClick={goToNotifications}>
          <FaBell size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
      </div>

      <div className="sticky top-[88px] z-20 bg-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-1/2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        <Link to="/add-task">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-4">
            + Add New Task
          </button>
        </Link>
      </div>

      <div className="px-6 pb-10 space-y-4 mt-6">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400">No tasks found for your search.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="flex bg-gray-800 p-4 rounded-lg shadow-md items-start"
            >
              <img
                src={task.picture || "https://via.placeholder.com/80"}
                alt={task.title}
                className="w-20 h-20 rounded-lg mr-4 object-cover"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold">{task.title}</h2>
                <p className="text-gray-300 mb-2">{task.description}</p>

                <div className="flex flex-col sm:flex-row text-sm text-gray-400 gap-2 sm:space-x-4 mb-2">
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

                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition"
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
