'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("https://imcwire.com/");
  }, []); 

  return null;
}

export default Home;
