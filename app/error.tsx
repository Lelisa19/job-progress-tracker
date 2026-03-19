// C:\Users\laloo\job-progress-tracker\app\page.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to Job Progress Tracker
      </h1>
      <p className="text-lg mb-8 text-center text-gray-700">
        Manage daily workers, track attendance, job progress, and payments efficiently.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Employer Dashboard Link */}
        <Link
          href="/(dashboard)/employer/dashboard"
          className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Employer Dashboard
        </Link>

        {/* Worker Dashboard Link */}
        <Link
          href="/(dashboard)/worker/dashboard"
          className="px-6 py-4 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Worker Dashboard
        </Link>
      </div>
    </div>
  );
}