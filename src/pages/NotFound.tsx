"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    console.error("404 - Page not found");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Page not found</p>
        <button onClick={() => router.push("/")} className="text-blue-500 underline">
          Go back home
        </button>
      </div>
    </div>
  );
};

export default NotFound;