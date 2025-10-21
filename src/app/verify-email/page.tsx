"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
export default function Page() {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");
  useEffect(() => {
    console.log("token", token);
  });
  return <div>page</div>;
}
