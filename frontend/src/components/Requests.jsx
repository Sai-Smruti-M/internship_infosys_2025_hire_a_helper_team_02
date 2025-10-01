import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const Requests = ({ notifications, refreshNotifications }) => {
  const navigate = useNavigate();


  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

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

  const handleAccept = async (reqId) => {
    try {
      await fetch(`http://localhost:5000/requests/${reqId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      refreshNotifications();
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (reqId) => {
    try {
      await fetch(`http://localhost:5000/requests/${reqId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      refreshNotifications();
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
    } catch (err) {
      console.error(err);
    }

  };

  return (
    <div className="ml-64 flex flex-col w-[calc(100%-16rem)] bg-gray-900 text-white min-h-screen border-l border-gray-700">
      
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-6 border-b border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-gray-400">People who want to help with your tasks</p>
        </div>


        <div className="relative cursor-pointer" onClick={() => navigate("/notification")}>


          <FaBell size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
      </div>

      
      <div className="sticky top-[88px] z-20 bg-gray-900 px-6 py-4 flex items-center border-b border-gray-700">
        <div className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-1/2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

     
      <div className="px-6 pb-10 mt-6 flex-1">
        {filteredRequests.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-gray-400 text-2xl font-semibold">No requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req._id}
            className="flex bg-white text-black p-4 rounded-lg shadow-md items-start"
          >


            
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4 overflow-hidden">
              {req.requester?.profile_picture ? (
                <img
                  src={req.requester.profile_picture}
                  alt={`${req.requester.first_name} ${req.requester.last_name}`}
                  className="w-12 h-12 object-cover"
                />
              ) : (
                `${req.requester?.first_name?.charAt(0) || ""}${
                  req.requester?.last_name?.charAt(0) || ""
                }`.toUpperCase()
              )}


            </div>

           
            <div className="flex-1">
              <h2 className="font-bold text-lg">


                {req.requester?.first_name} {req.requester?.last_name}
              </h2>

              <div className="bg-gray-200 p-2 rounded mt-3">
                <p className="font-semibold">Task:</p>
                <p>{req.task?.title || "Task Deleted"}</p>
                <p className="text-sm text-gray-600">
                  {req.task?.description || "No description available"}
                </p>
              </div>


              <div className="flex flex-col sm:flex-row text-sm text-gray-600 gap-2 sm:space-x-6 mt-2">
                <span className="flex items-center">
                  <FaRegClock className="mr-2" />{" "}
                  {req.task?.start_time
                    ? new Date(req.task.start_time).toLocaleString()
                    : "No start time"}
                </span>
                <span className="flex items-center">


                  <FaMapMarkerAlt className="mr-2" />{" "}
                  {req.task?.location || "No location"}


                </span>
              </div>
            </div>

          
            <div className="flex flex-col gap-2 ml-4">


              {req.status === "pending" ? (
                <>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    onClick={() => handleAccept(req._id)}
                    disabled={!req.task}

                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    onClick={() => handleDecline(req._id)}
                  >
                    Decline
                  </button>
                </>


              ) : (

                <span className="text-gray-500 font-semibold">{req.status}</span>
              )}
            </div>
          </div>
        ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
