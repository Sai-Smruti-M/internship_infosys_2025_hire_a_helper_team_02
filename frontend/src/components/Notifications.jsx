
import {FaRegClock } from "react-icons/fa";
const Notifications = ({ notifications }) => {
  return (
    <div className="ml-64 flex flex-col w-[calc(100%-16rem)] bg-gray-900 text-white min-h-screen border-l border-gray-700">
      <div className="sticky top-0 z-20 flex justify-between items-center bg-gray-900 p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
      </div>

      <div className="px-6 pb-10 space-y-4 mt-6">
        {notifications.length === 0 ? (
          <p className="text-gray-400">No notifications found.</p>
        ) : (
          notifications.map((note) => (
            <div key={note._id} className="flex flex-col bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">
                    🔔
                  </div>
                  <p className="text-gray-100 font-semibold">{note.body}</p>
                </div>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <FaRegClock /> {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Notifications;