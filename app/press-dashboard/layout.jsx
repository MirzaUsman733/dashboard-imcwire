import React from "react";
import SidebarDashboard from "../components/SidebarDashboard";
import TalkTo from '../components/TawkTo'
const Layout = ({ children }) => {
  return (
    <>
      <div className="hidden md:block">
        <TalkTo/>
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
