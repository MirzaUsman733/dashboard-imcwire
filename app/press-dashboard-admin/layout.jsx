import React from "react";
import SidebarDashboard from "../components/SidebarAdmin";
import { UserProvider } from "../contexts/userData";

const Layout = ({ children }) => {
  return (
    <>
      {/* <UserProvider> */}
        <div className="hidden md:block">
          <SidebarDashboard>{children}</SidebarDashboard>
        </div>
        <div className="block md:hidden">
          <SidebarDashboard />
          {children}
        </div>
      {/* </UserProvider> */}
    </>
  );
};

export default Layout;
