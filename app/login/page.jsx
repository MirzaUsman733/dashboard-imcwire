'use client'
import React, { useState, useEffect } from "react";
import Auth from "../components/Auth";
import { useSession } from "next-auth/react";
import { InfinitySpin } from "react-loader-spinner";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/press-dashboard/pr-balance");
    } else {
      setLoading(false); 
    }
  }, [sessionStatus, router]);

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center w-full">
        <InfinitySpin
          visible={true}
          width={200}
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  } else if (!session && sessionStatus === "unauthenticated") {
    return (
      <div className="body-container">
        <div className="h-[100vh] flex justify-center items-center">
          <Auth />
        </div>
      </div>
    );
  } else {
    return null; // Render nothing if neither loading nor authentication required
  }
};

export default Page;
