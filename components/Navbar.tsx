// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../app/contexts/AuthContext";
import { Bell, Wrench } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import NotificationsPanel from "./notifications/NotificationPanel";
import type { NavNotification } from "@/types/notification";

export default function Navbar() {
  const pathname = usePathname();
  const isAppDashboard =
    pathname?.startsWith("/employer") || pathname?.startsWith("/worker");
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isAppDashboard) {
    return null;
  }

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [notifications, setNotifications] = useState<NavNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

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

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const onMarkRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

  const onMarkAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 border-b border-gray-100 bg-white px-6 py-5">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb] text-white shadow-sm">
          <Wrench className="h-5 w-5" strokeWidth={2.2} aria-hidden />
        </div>
        <span className="text-xl font-bold tracking-tight text-[#0f172a]">
          JobTracker
        </span>
      </Link>

      <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
        <Link
          href="/#features"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Features
        </Link>
        <Link
          href="/#about"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          About
        </Link>
        <Link
          href="/#contact"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Contact
        </Link>
      </div>

      {isLoading ? (
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      ) : user ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              ref={notificationButtonRef}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[10px] font-bold text-white">
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

          <div className="flex items-center gap-3">
            <Link 
              href={user.role?.toLowerCase() === 'worker' ? '/worker/profile' : '/employer/settings'}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs capitalize text-gray-500">{user.role}</div>
              </div>
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full border border-gray-200 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {user.initials}
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Log out
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-700 hover:text-black"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}
