'use client'
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SessionTimeout = ({ children, timeout }) => {
    const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    const sessionStartTime = session?.user?.now;
    localStorage.setItem("sessionStartTime", sessionStartTime);

    const timer = setTimeout(() => {
      logoutUser();
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const logoutUser = async () => {
    try {
      await signOut({ redirect: false });
      router.push("dashboard.imcwire.com/login");
      console.log("User has been logged out due to inactivity");
    } catch (error) {
      console.error("Error logging out user:", error);
    }
  };

  return <>{children}</>;
};

export default SessionTimeout;
