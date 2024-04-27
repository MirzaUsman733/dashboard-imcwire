'use client'
import React from "react";
import SidebarDashboard from "../components/SidebarAdmin";
import { useSession } from "next-auth/react";

const Layout = ({ children }) => {
  const { data: session, status: sessionStatus } = useSession();
  return (
    <>
      {!session ? (
        ""
      ) : (
        <>
          {/* <UserProvider> */}
          <div className="hidden md:block">
            <SidebarDashboard>{children}</SidebarDashboard>
          </div>
          <div className="block md:hidden">
            <SidebarDashboard />
            {children}
          </div>
        </>
      )}
    </>
  );
};

export default Layout;
