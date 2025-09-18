import React from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";

const MyRequests = () => {
  const myRequests = [
    {
      id: 1,
      title: "Help Moving Furniture",
      category: "moving",
      owner: "Sarah Johnson",
      message:
        "I'd be happy to help with your move! I have experience with heavy lifting and can bring some moving equipment. Available Saturday afternoon as requested.",
      time: "Jul 4, 10:00AM",
      location: "Downtown Seattle, WA",
      image:
        "https://media.istockphoto.com/id/1308620740/photo/cardboard-boxes-and-packed-chair-in-office-moving-day.jpg?s=612x612&w=0&k=20&c=VuVQJ_i0N1NY0fGH5F5Ci-NO3DU-EnmrouINLWVUcdE=",
      status: "pending",
    },
    {
      id: 2,
      title: "Computer Setup Assistance",
      category: "IT",
      owner: "John Doe",
      message:
        "Available tomorrow evening to help with computer setup, software installation, and troubleshooting.",
      time: "Jul 6, 3:00PM",
      location: "Bellevue, WA",
      image:
        "https://images.pexels.com/photos/12200696/pexels-photo-12200696.jpeg",
      status: "approved",
    },
  ];

  return (
    <div className="ml-64 flex flex-col w-[calc(100%-16rem)] bg-gray-900 text-white min-h-screen border-l border-gray-700">
      
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-6 border-b border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-gray-400">Track the help requests you’ve sent</p>
        </div>
        <div className="relative">
          <FaBell size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            3
          </span>
        </div>
      </div>

      
      <div className="sticky top-[88px] z-20 bg-gray-900 px-6 py-4 flex items-center border-b border-gray-700">
        <div className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-1/2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full outline-none"
          />
        </div>
      </div>

      
      <div className="px-6 pb-10 space-y-4 mt-6">
        {myRequests.map((req) => (
          <div
            key={req.id}
            className="flex flex-col bg-white text-black p-4 rounded-lg shadow-md"
          >
           
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl mr-3">
                  👤
                </div>
                <div>
                  <h2 className="font-bold text-lg">{req.title}</h2>
                  <p className="text-sm text-gray-600">
                    Task owner: {req.owner}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="bg-sky-200 text-sky-700 text-xs font-semibold px-2 py-1 rounded">
                  {req.category}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    req.status === "pending"
                      ? "bg-orange-200 text-orange-700"
                      : "bg-green-200 text-green-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            </div>

           
            <div className="bg-gray-200 p-3 rounded mt-3">
              <p className="font-semibold">Your message:</p>
              <p className="text-sm text-gray-700 mt-1">{req.message}</p>
            </div>

            
            <div className="flex flex-col sm:flex-row text-sm text-gray-600 gap-2 sm:space-x-6 mt-2">
              <span className="flex items-center">
                <FaRegClock className="mr-2" /> Sent {req.time}
              </span>
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {req.location}
              </span>
            </div>

            
            {req.image && (
              <div className="mt-3">
                <img
                  src={req.image}
                  alt={req.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
