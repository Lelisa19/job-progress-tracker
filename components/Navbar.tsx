// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../app/contexts/AuthContext";
import { Bell } from "lucide-react";
import { useState, useRef } from "react";
import NotificationsPanel from "./notifications/NotificationPanel";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-5 max-w-7xl mx-auto bg-white border-b border-gray-100">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="text-blue-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight">JobTracker</span>
      </Link>

      {/* Right side */}
      {isLoading ? (
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      ) : user ? (
        <div className="flex items-center gap-4">
          {/* Notification Bell - Only when logged in */}
          <div className="relative">
            <button
              ref={notificationButtonRef}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {/* Unread badge - you can make this dynamic later */}
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            {/* Notifications Panel - Only render if ref exists */}
            {notificationButtonRef.current && (
              <NotificationsPanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                buttonRef={notificationButtonRef as React.RefObject<HTMLButtonElement>}
              />
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.initials}
            </div>
          </div>
        </div>
      ) : (
        /* Login/Signup buttons */
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-black">
            Log in
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-[#2563eb] text-white text-sm font-medium rounded-md hover:bg-blue-700">
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}