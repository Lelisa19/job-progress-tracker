"use client";

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import type { NavNotification } from "@/types/notification";
import {
  Bell,
  CheckCheck,
  ClipboardList,
  DollarSign,
  UserCheck,
  AlertCircle,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  notifications: NavNotification[];
  readIds: Set<string>;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsPanel({
  isOpen,
  onClose,
  buttonRef,
  notifications,
  readIds,
  onMarkRead,
  onMarkAllRead,
}: NotificationsPanelProps) {
  const { user } = useAuth();

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const getIcon = (type: string, priority?: string) => {
    switch (type) {
      case "task":
        return <ClipboardList className="h-5 w-5 text-blue-500" />;
      case "attendance":
        return priority === "high" ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : (
          <UserCheck className="h-5 w-5 text-orange-500" />
        );
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "job":
      case "project":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
      style={{
        top: buttonRef.current ? buttonRef.current.offsetTop + 40 : 0,
        right: 0,
      }}
    >
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="mt-3 flex gap-2">
            {notifications.filter((n) => n.type === "task" && !readIds.has(n.id))
              .length > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                {
                  notifications.filter(
                    (n) => n.type === "task" && !readIds.has(n.id)
                  ).length
                }{" "}
                tasks
              </span>
            )}
            {notifications.filter(
              (n) => n.type === "attendance" && !readIds.has(n.id)
            ).length > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                {
                  notifications.filter(
                    (n) => n.type === "attendance" && !readIds.has(n.id)
                  ).length
                }{" "}
                attendance
              </span>
            )}
            {notifications.filter(
              (n) => n.type === "payment" && !readIds.has(n.id)
            ).length > 0 && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                {
                  notifications.filter(
                    (n) => n.type === "payment" && !readIds.has(n.id)
                  ).length
                }{" "}
                payments
              </span>
            )}
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications
              .filter((n) => !readIds.has(n.id))
              .map((notification) => (
                <div
                  key={notification.id}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50"
                  onClick={() => onMarkRead(notification.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      onMarkRead(notification.id);
                  }}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(notification.type, notification.priority)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-800">
                          {notification.title}
                        </h4>
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                        {notification.actionUrl && (
                          <Link
                            href={notification.actionUrl}
                            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {notifications.some((n) => readIds.has(n.id)) && (
              <>
                <div className="bg-gray-50 px-4 py-2">
                  <span className="text-xs font-medium text-gray-500">
                    EARLIER
                  </span>
                </div>
                {notifications
                  .filter((n) => readIds.has(n.id))
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="border-b border-gray-100 p-4 opacity-75"
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-700">
                            {notification.title}
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-3">
        <Link
          href={user?.role === "worker" ? "/worker/dashboard" : "/employer/dashboard"}
          className="block text-center text-sm font-medium text-blue-500 hover:text-blue-600"
          onClick={onClose}
        >
          View dashboard
        </Link>
      </div>
    </div>
  );
}
