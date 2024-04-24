import React from "react";
import SidebarDashboard from "../components/SidebarDashboard";
const Layout = ({ children }) => {
  return (
    <>
      <div className="hidden md:block">
        <SidebarDashboard>{children}</SidebarDashboard>
      </div>
      <div className="block md:hidden">
        <SidebarDashboard />
        {children}
      </div>
    </>
  );
};

export default Layout;
