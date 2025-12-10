"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("https://hiregenx.vercel.app/");
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <h1 className="text-xl font-semibold">Redirecting...</h1>
    </div>
  );
};

export default Home;
