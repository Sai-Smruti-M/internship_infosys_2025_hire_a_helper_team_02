import { FaRegClock, FaBell } from "react-icons/fa";

const Notifications = ({ notifications }) => {
  return (
    <div
          className="flex flex-col bg-gray-900 text-white min-h-screen 
          w-full mt-16 md:mt-0 md:ml-64 md:w-[calc(100%-16rem)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-4 md:p-6 border-b border-gray-700">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Notification</h1>
              
            </div>
            
          </div>

      {/* Notification List */}
      <div className="px-4 sm:px-6 pb-10 mt-6 space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center sm:text-left">No notifications found.</p>
        ) : (
          notifications.map((note) => (
            <div
              key={note._id}
              className="flex flex-col sm:flex-row justify-between bg-gray-800 p-4 rounded-lg shadow-md gap-2 sm:gap-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">
                  🔔
                </div>
                <p className="text-gray-100 font-semibold">{note.body}</p>
              </div>
              <span className="text-gray-400 text-xs flex items-center gap-1 mt-2 sm:mt-0">
                <FaRegClock /> {new Date(note.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
