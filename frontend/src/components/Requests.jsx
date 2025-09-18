import React from "react";
import { FaBell, FaSearch, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";

const Requests = () => {
  const requests = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 4.8,
      reviews: 18,
      description:
        "Hi! I'd love to help with your computer setup. I have 5+ years of IT experience and can handle networking, software installation, and troubleshooting. Available tomorrow afternoon as requested.",
      request: "Computer setup help",
      time: "Jul 6, 3:00PM",
      distance: "within 5 miles",
    },
    {
      id: 2,
      name: "Emily Chan",
      rating: 4.8,
      reviews: 18,
      description:
        "I'd be happy to help with your computer setup! I'm a software engineer with experience in home networking and system configuration. I can bring my own tools if needed.",
      request: "Computer setup help",
      time: "Jul 6, 3:00PM",
      distance: "within 5 miles",
    },

    {
      id: 2,
      name: "Emily Chan",
      rating: 4.8,
      reviews: 18,
      description:
        "I'd be happy to help with your computer setup! I'm a software engineer with experience in home networking and system configuration. I can bring my own tools if needed.",
      request: "Computer setup help",
      time: "Jul 6, 3:00PM",
      distance: "within 5 miles",
    },

    {
      id: 2,
      name: "Emily Chan",
      rating: 4.8,
      reviews: 18,
      description:
        "I'd be happy to help with your computer setup! I'm a software engineer with experience in home networking and system configuration. I can bring my own tools if needed.",
      request: "Computer setup help",
      time: "Jul 6, 3:00PM",
      distance: "within 5 miles",
    },
  ];

  return (
    <div className="ml-64 flex flex-col w-[calc(100%-16rem)] bg-gray-900 text-white min-h-screen border-l border-gray-700">
     
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-6 border-b border-gray-700">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-gray-400">People who want to help with your tasks</p>
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
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex bg-white text-black p-4 rounded-lg shadow-md items-start"
          >
            
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl mr-4">
              👤
            </div>

            
            <div className="flex-1">
              <h2 className="font-bold text-lg">
                {req.name}{" "}
                <span className="text-yellow-500">⭐</span>{" "}
                <span className="text-sm text-gray-600">
                  {req.rating} ({req.reviews} reviews)
                </span>
              </h2>
              <p className="text-gray-700 mt-1">{req.description}</p>

             
              <div className="bg-gray-200 p-2 rounded mt-3">
                <p className="font-semibold">Requesting for:</p>
                <p>{req.request}</p>
              </div>

              
              <div className="flex flex-col sm:flex-row text-sm text-gray-600 gap-2 sm:space-x-6 mt-2">
                <span className="flex items-center">
                  <FaRegClock className="mr-2" /> {req.time}
                </span>
                <span className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> {req.distance}
                </span>
              </div>
            </div>

            
            <div className="flex flex-col gap-2 ml-4">
              <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
                Accept
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
