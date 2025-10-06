import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user || !token) return; // only for logged-in users

    // Push dummy history state to detect back
    const pushDummyState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    pushDummyState();

    const handlePopState = (e) => {
      e.preventDefault();
      setShowConfirm(true);
      pushDummyState(); // prevent actual back navigation
    };

    // Handle browser back button
    window.addEventListener("popstate", handlePopState);

    // Optional: handle tab close or refresh
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // show default browser alert
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user, token]);

  const confirmLeave = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowConfirm(false);
    window.location.href = "/"; // redirect to login
  };

  const cancelLeave = () => {
    setShowConfirm(false);
    // Push dummy state again to prevent back
    window.history.pushState(null, "", window.location.href);
  };

  if (!user || !token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return (
    <>
      {children}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-gray-800">
            <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Going back will log you out. You will need to sign in again.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLeave}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Stay
              </button>
              <button
                onClick={confirmLeave}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
