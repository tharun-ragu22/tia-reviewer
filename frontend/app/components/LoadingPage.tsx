"use client";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full h-56 flex flex-col items-center justify-center gap-4 select-none">
      <div className="w-36 h-36 rounded-full bg-black shadow-lg flex items-center justify-center">
        <svg
          className="w-16 h-16 text-white animate-spin"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M45 25a20 20 0 0 0-6.7-14.3"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="text-xl font-semibold text-black">
        Loading{".".repeat(dots)}
      </div>
    </div>
  );
}
