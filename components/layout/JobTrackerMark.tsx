import Link from "next/link";
import React from "react";

export function JobTrackerMark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 outline-none transition-opacity hover:opacity-90 ${className}`}
      aria-label="JobTracker home"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6] shadow-sm"
        aria-hidden
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight text-gray-900">
        JobTracker
      </span>
    </Link>
  );
}
