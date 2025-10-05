import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  const location = useLocation(); // Get current location

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {/* Force remount when path changes */}
        <Outlet key={location.pathname} />
      </div>
    </div>
  );
};

export default Layout;
