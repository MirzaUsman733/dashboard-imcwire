// pages/thankyou.js

"use client";
// export const dynamic = "force-dynamic";
export const dynamic = 'auto'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const Page = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ordId = urlParams.get("ordId");
      if (ordId) {
        router.push(`/thankyou/${ordId}`);
      }
    }
  }, []);
  return (
    <div></div>
  );
};

export default Page;
