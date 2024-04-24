'use client'
import React, { useEffect, useState } from "react";
import AdminPanel from "../components/AdminPanel";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    // Only refresh the page when it mounts for the first time
    if (!refreshed) {
      window.location.reload();
      setRefreshed(true); 
    }
  }, [refreshed]);

  return (
    <div>
      <AdminPanel />
    </div>
  );
};

export default Page;
