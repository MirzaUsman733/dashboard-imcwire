
// import React, { useEffect } from "react";
import SidebarDashboard from "../components/SidebarDashboard";
// import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
import SessionTimeout from '../components/SessionTimeout'
const Layout = ({ children }) => {
  // const router = useRouter()
  // const SESSION_TIMEOUT = 1 * 60 * 1000; 

  // useEffect(() => {
  //   const sessionStartTime = new Date().getTime();
  //   localStorage.setItem("sessionStartTime", sessionStartTime);

  //   const timer = setTimeout(() => {
  //     logoutUser();
  //   }, SESSION_TIMEOUT);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  // const logoutUser = async () => {
  //   try {
  //     await signOut({ redirect: false });
  //     router.push("dashboard.imcwire.com/login");
  //     console.log("User has been logged out due to inactivity");
  //   } catch (error) {
  //     console.error("Error logging out user:", error);
  //   }
  // };

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
