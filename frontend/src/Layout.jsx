
import React, { useEffect, useRef, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const Layout = () => {

  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const popHandlerRef = useRef(null); // to store the handler so we can remove it later

  useEffect(() => {
    // If already installed, don't install again (prevents duplicate pushes)
    if (popHandlerRef.current) return;

    // 1) Mark current entry with a flag (replace)
    const existingState = window.history.state || {};
    window.history.replaceState({ ...existingState, __protectedGuard: true }, document.title, window.location.href);

    // 2) Push a dummy state so the back button will go to the state we just marked
    window.history.pushState({}, document.title, window.location.href);

    // 3) Create the popstate handler
    const onPop = (e) => {
      // When user clicks back, show the modal and immediately re-push a dummy entry
      // (this keeps the user on the current page until they confirm).
      setShowConfirm(true);
      // Re-add dummy entry so we stay on the page
      window.history.pushState({}, document.title, window.location.href);
    };

    popHandlerRef.current = onPop;
    window.addEventListener("popstate", onPop);

    // cleanup
    return () => {
      if (popHandlerRef.current) {
        window.removeEventListener("popstate", popHandlerRef.current);
        popHandlerRef.current = null;
      }
    };
  }, []); // run once when Layout mounts

  const confirmLeave = () => {
    // Remove handler first to avoid re-trigger while navigating away
    if (popHandlerRef.current) {
      window.removeEventListener("popstate", popHandlerRef.current);
      popHandlerRef.current = null;
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setShowConfirm(false);
    // Hard redirect to root so everything is clean
    window.location.href = "/";
  };

  const cancelLeave = () => {
    setShowConfirm(false);
    // make sure guard stays in place
    window.history.pushState({}, document.title, window.location.href);
  };


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">

        <Outlet key={location.pathname} />
      </div>

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
    </div>
  );
};

export default Layout;
