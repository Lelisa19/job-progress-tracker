"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../app/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-5 max-w-7xl mx-auto bg-white">
      {/* Logo - Always visible */}
      <div className="flex items-center gap-2">
        <div className="text-blue-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight">JobTracker</span>
      </div>

      {/* Right side - Conditional rendering */}
      {isLoading ? (
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      ) : user ? (
        /* Show profile when logged in */
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.initials}
          </div>
        </div>
      ) : (
        /* Show login/signup when not logged in */
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-black transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-[#2563eb] text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}