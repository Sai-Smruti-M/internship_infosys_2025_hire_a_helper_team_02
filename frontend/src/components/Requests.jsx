import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Requests = ({ notifications, refreshNotifications }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // 👈 loading state added

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/requests/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching requests:", err));
  }, [user]);

  const filteredRequests = requests.filter((req) => {
    const searchLower = search.toLowerCase();
    return (
      req.task?.title?.toLowerCase().includes(searchLower) ||
      req.task?.description?.toLowerCase().includes(searchLower) ||
      req.task?.location?.toLowerCase().includes(searchLower) ||
      req.requester?.first_name?.toLowerCase().includes(searchLower) ||
      req.requester?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Accept Request
  const handleAccept = async (reqId) => {
    setLoading(true); // show loader
    try {
      const response = await fetch(`http://localhost:5000/requests/${reqId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (!response.ok) throw new Error("Failed to accept request");

      refreshNotifications();
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
      toast.success("Request accepted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error accepting the request. Please try again.");
    } finally {
      setLoading(false); // hide loader
    }
  };

  // ✅ Reject Request
  const handleDecline = async (reqId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/requests/${reqId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (!response.ok) throw new Error("Failed to reject request");

      refreshNotifications();
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
      toast.info("Request rejected successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };
   const goToNotifications = () => navigate("/notification");

  const goToNotifications = () => navigate("/notification");

  return (
    <div
      className="flex flex-col bg-gray-900 text-white min-h-screen 
      w-full mt-16 md:mt-0 md:ml-64 md:w-[calc(100%-16rem)]"
    >
      {/* ✅ Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 bg-white/90 rounded-xl shadow-xl">
            <span className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 font-semibold">Processing...</p>
            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-4 md:p-6 border-b border-gray-700">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Requests</h1>
          <p className="text-gray-400 text-sm md:text-base">
            People who want to help with your tasks
          </p>
        </div>
        <div className="relative cursor-pointer" onClick={goToNotifications}>
          <FaBell size={22} className="md:size-15" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-[64px] md:top-[88px] z-20 bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 flex items-center border-b border-gray-700">
        <div className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-full sm:w-1/2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full outline-none text-sm sm:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="px-4 sm:px-6 pb-10 mt-6 flex-1 space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-gray-400 text-2xl font-semibold">
              No requests found.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req._id}
              className="flex flex-col sm:flex-row bg-white text-black p-4 rounded-lg shadow-md gap-4"
            >
              {/* Profile */}
              <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-xl bg-gray-200">
                {req.requester?.profile_picture ? (
                  <img
                    src={req.requester.profile_picture}
                    alt={`${req.requester.first_name} ${req.requester.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  `${req.requester?.first_name?.charAt(0) || ""}${
                    req.requester?.last_name?.charAt(0) || ""
                  }`.toUpperCase()
                )}
              </div>

              {/* Task Info */}
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
                <div className="flex-1">
                  <h2 className="font-bold text-lg">
                    {req.requester?.first_name} {req.requester?.last_name}
                  </h2>

                  <div className="bg-gray-200 p-2 rounded mt-2">
                    <p className="font-semibold">Task:</p>
                    <p>{req.task?.title || "Task Deleted"}</p>
                    <p className="text-sm text-gray-600">
                      {req.task?.description || "No description available"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row text-sm text-gray-600 gap-2 sm:space-x-6 mt-2">
                    <span className="flex items-center">
                      <FaRegClock className="mr-2" />
                      {req.task?.start_time
                        ? new Date(req.task.start_time).toLocaleString()
                        : "No start time"}
                    </span>
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      {req.task?.location || "No location"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                  {req.status === "pending" ? (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                        onClick={() => handleAccept(req._id)}
                        disabled={!req.task || loading}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                        onClick={() => handleDecline(req._id)}
                        disabled={loading}
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 font-semibold px-4 py-2 rounded-lg bg-gray-200 w-full text-center sm:w-auto">
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
