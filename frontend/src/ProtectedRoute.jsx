import React, { useEffect, useState } from "react";

import { Navigate, useLocation, useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();



  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!(user && token)) return;

    const HASH_GUARD = '#session';
    const ensureHashGuard = () => {
      if (window.location.hash !== HASH_GUARD) {
        try {
          window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + HASH_GUARD);
  } catch { /* ignore replaceState errors */ }
      }
    };

    const pushDummy = () => {
      try {
        window.history.pushState({ guard: Date.now() }, "");
  } catch { /* ignore pushState errors */ }
    };

    // Arm on mount
    ensureHashGuard();
    pushDummy();

    const handlePop = () => {
      const u = JSON.parse(localStorage.getItem('user'));
      const t = localStorage.getItem('token');
      if (u && t) {
        setShowConfirm(true);
        pushDummy();
        ensureHashGuard();
      } else {
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [user, token, navigate]);

  const confirmLogoutAndBack = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowConfirm(false);
    navigate('/', { replace: true });
  };

  const cancelBack = () => {
    setShowConfirm(false);
    // No extra action needed; guard already re-armed during pop handler
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
            <h2 className="text-lg font-semibold mb-2">Leave this session?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Going back will log you out. You will need to sign in again to access your dashboard.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelBack}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Stay
              </button>
              <button
                onClick={confirmLogoutAndBack}
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