'use client'
import { useSession } from "next-auth/react";
import SidebarDashboard from "../components/SidebarDashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [sessionStatus, router]);

  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <InfinitySpin
          visible={true}
          width="200"
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

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
