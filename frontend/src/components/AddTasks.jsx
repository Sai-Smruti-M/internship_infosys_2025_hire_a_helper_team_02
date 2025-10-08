import React, { useState } from "react";
import { FaBell, FaTrash, FaCamera } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddTasks = ({ notifications }) => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      setTaskData({ ...taskData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setTaskData({ ...taskData, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setTaskData({ ...taskData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        toast.error("Please login first");
        return;
      }

      const formData = new FormData();
      formData.append("user_id", storedUser.id);
      formData.append("title", taskData.title);
      formData.append("description", taskData.description);
      formData.append("location", taskData.location);
      formData.append("start_time", `${taskData.startDate}T${taskData.startTime}`);
      if (taskData.endDate && taskData.endTime) {
        formData.append("end_time", `${taskData.endDate}T${taskData.endTime}`);
      }
      formData.append("status", "pending");
      formData.append("category", taskData.category);
      if (taskData.image) {
        formData.append("picture", taskData.image);
      }

      const res = await axios.post("http://localhost:5000/add-tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Task created successfully!");
        setTaskData({
          title: "",
          description: "",
          location: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          category: "",
          image: null,
        });
        setImagePreview(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const goToNotifications = () => navigate("/notification");

  return (
    <div className="flex flex-col bg-gray-900 text-white min-h-screen w-full mt-16 md:mt-0 md:ml-64 md:w-[calc(100%-16rem)]">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/90 rounded-xl shadow-xl">
            <span className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 font-semibold">Posting Task...</p>
            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-4 md:p-6 border-b border-gray-700">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Add Tasks</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Create a task and find someone to help you
          </p>
        </div>
        <div className="relative cursor-pointer" onClick={goToNotifications}>
          <FaBell size={22} className="md:size-15" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="flex justify-center mt-6 px-4 sm:px-6 pb-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-2xl"
        >
          <h2 className="text-2xl font-bold mb-1">Add New Task</h2>
          <p className="text-gray-600 mb-6">Create a task and find someone to help you</p>

          <label className="block font-semibold">Task Title</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            required
          />

          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
            rows="3"
          />

          <label className="block font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={taskData.location}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={taskData.startDate}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4"
              />
            </div>
            <div>
              <label className="block font-semibold">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={taskData.startTime}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4"
              />
            </div>
            <div>
              <label className="block font-semibold">End Date (Optional)</label>
              <input
                type="date"
                name="endDate"
                value={taskData.endDate}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4"
              />
            </div>
            <div>
              <label className="block font-semibold">End Time (Optional)</label>
              <input
                type="time"
                name="endTime"
                value={taskData.endTime}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-4"
              />
            </div>
          </div>

          <label className="block font-semibold">Category</label>
          <select
            name="category"
            value={taskData.category}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="">Select category</option>
            <option value="moving">Moving</option>
            <option value="cleaning">Cleaning</option>
            <option value="it">IT Support</option>
            <option value="other">Other</option>
          </select>

          <label className="block font-semibold">Task Image (Optional)</label>
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center mb-6">
              <input
                type="file"
                name="image"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-3xl">📤</span>
                  <p>Upload a File or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative mb-6">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 right-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-red-600"
                >
                  <FaTrash /> Remove
                </button>
                <label
                  htmlFor="file-upload"
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-600"
                >
                  <FaCamera /> Change
                  <input
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded w-full sm:w-auto hover:bg-blue-600"
            >
              Post Task
            </button>
            <button
              type="button"
              className="text-gray-600 font-semibold hover:underline w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTasks;
