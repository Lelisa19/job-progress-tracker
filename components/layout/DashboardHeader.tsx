"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import NotificationsPanel from "@/components/notifications/NotificationPanel";
import type { NavNotification } from "@/types/notification";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [notifications, setNotifications] = useState<NavNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    fetch("/api/notifications", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.notifications) setNotifications(d.notifications);
      })
      .catch(() => setNotifications([]));
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!user) setReadIds(new Set());
  }, [user]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const onMarkRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

  const onMarkAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const name = user?.name ?? "—";
  const roleLabel = user?.role === "worker" ? "Worker" : "Employer";
  const initials =
    user?.initials ??
    name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
      
  const profileLink = user?.role === 'worker' ? '/worker/profile' : '/employer/settings';

  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-gray-200/80 bg-white px-6 relative z-30">
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative flex items-center">
          <button
            type="button"
            ref={notificationButtonRef}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <NotificationsPanel
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            buttonRef={notificationButtonRef}
            notifications={notifications}
            readIds={readIds}
            onMarkRead={onMarkRead}
            onMarkAllRead={onMarkAllRead}
          />
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 transition-opacity hover:opacity-80 focus:outline-none"
          >
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full border border-gray-200 object-cover shadow-sm"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-sm"
                aria-hidden
              >
                {initials}
              </div>
            )}
            <div className="leading-tight text-left">
              <p className="text-sm font-semibold text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{roleLabel}</p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Link
                href={profileLink}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {user?.role === 'worker' ? <UserIcon className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                {user?.role === 'worker' ? 'My Profile' : 'Settings'}
              </Link>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
