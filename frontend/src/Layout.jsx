import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  const location = useLocation(); 

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        
        <Outlet key={location.pathname} />
      </div>
    </div>
  );
};

export default Layout;
