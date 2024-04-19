'use client'
import React, { useEffect } from "react";
import AdminPanel from "../components/AdminPanel";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  return (
    <div>
      <AdminPanel />
    </div>
  );
};

export default Page;
