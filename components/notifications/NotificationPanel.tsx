// app/components/NotificationsPanel.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import {
    Bell,
    CheckCheck,
    ClipboardList,
    DollarSign,
    UserCheck,
    AlertCircle,
    Calendar,
    ChevronRight,
    X
} from "lucide-react";

interface Notification {
    id: string;
    type: "task" | "attendance" | "payment" | "project" | "worker" | "job";
    title: string;
    message: string;
    time: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    priority?: "high" | "medium" | "low";
}

interface NotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
}

export default function NotificationsPanel({ isOpen, onClose, buttonRef }: NotificationsPanelProps) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load notifications based on user role
    useEffect(() => {
        if (!user) return;

        if (user.role === "employer") {
            setNotifications([
                {
                    id: "1",
                    type: "task",
                    title: "New Task Assigned",
                    message: "Electrical work scheduled for Downtown Project",
                    time: "5 min ago",
                    timestamp: new Date(Date.now() - 5 * 60 * 1000),
                    read: false,
                    actionUrl: "/employer/tasks/123",
                    priority: "high"
                },
                {
                    id: "2",
                    type: "attendance",
                    title: "Worker Check-in Alert",
                    message: "5 workers checked in late at Riverside Apartments",
                    time: "15 min ago",
                    timestamp: new Date(Date.now() - 15 * 60 * 1000),
                    read: false,
                    actionUrl: "/employer/attendance",
                    priority: "medium"
                },
                {
                    id: "3",
                    type: "payment",
                    title: "Payment Confirmed",
                    message: "Payment of $2,500 to workers processed",
                    time: "1 hour ago",
                    timestamp: new Date(Date.now() - 60 * 60 * 1000),
                    read: false,
                    actionUrl: "/employer/payments",
                    priority: "medium"
                }
            ]);
        } else if (user.role === "worker") {
            setNotifications([
                {
                    id: "1",
                    type: "task",
                    title: "New Task Assigned",
                    message: "You've been assigned to 'Foundation Work' at Downtown Project",
                    time: "10 min ago",
                    timestamp: new Date(Date.now() - 10 * 60 * 1000),
                    read: false,
                    actionUrl: "/worker/tasks/123",
                    priority: "high"
                },
                {
                    id: "2",
                    type: "job",
                    title: "Job Update",
                    message: "Riverside Apartments project start date changed to Monday",
                    time: "30 min ago",
                    timestamp: new Date(Date.now() - 30 * 60 * 1000),
                    read: false,
                    actionUrl: "/worker/projects/456",
                    priority: "medium"
                },
                {
                    id: "3",
                    type: "payment",
                    title: "Payment Received",
                    message: "Your payment of $850 has been processed",
                    time: "2 hours ago",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    read: false,
                    actionUrl: "/worker/payments",
                    priority: "high"
                }
            ]);
        }

        setUnreadCount(prev => notifications.filter(n => !n.read).length);
    }, [user]);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    };

    const getIcon = (type: string, priority?: string) => {
        switch (type) {
            case "task":
                return <ClipboardList className="w-5 h-5 text-blue-500" />;
            case "attendance":
                return priority === "high"
                    ? <AlertCircle className="w-5 h-5 text-red-500" />
                    : <UserCheck className="w-5 h-5 text-orange-500" />;
            case "payment":
                return <DollarSign className="w-5 h-5 text-green-500" />;
            case "job":
            case "project":
                return <Calendar className="w-5 h-5 text-purple-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
            style={{
                top: buttonRef.current ? buttonRef.current.offsetTop + 40 : 0,
                right: 0
            }}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                            >
                                <CheckCheck className="w-3 h-3" />
                                Mark all read
                            </button>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Summary Chips */}
                {unreadCount > 0 && (
                    <div className="flex gap-2 mt-3">
                        {notifications.filter(n => n.type === "task" && !n.read).length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {notifications.filter(n => n.type === "task" && !n.read).length} tasks
                            </span>
                        )}
                        {notifications.filter(n => n.type === "attendance" && !n.read).length > 0 && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                {notifications.filter(n => n.type === "attendance" && !n.read).length} attendance
                            </span>
                        )}
                        {notifications.filter(n => n.type === "payment" && !n.read).length > 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                {notifications.filter(n => n.type === "payment" && !n.read).length} payments
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                ) : (
                    <>
                        {/* Unread first */}
                        {notifications.filter(n => !n.read).map((notification) => (
                            <div
                                key={notification.id}
                                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getIcon(notification.type, notification.priority)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h4 className="text-sm font-medium text-gray-800">
                                                {notification.title}
                                            </h4>
                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-400">{notification.time}</span>
                                            {notification.actionUrl && (
                                                <Link
                                                    href={notification.actionUrl}
                                                    className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    View
                                                    <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Read notifications */}
                        {notifications.filter(n => n.read).length > 0 && (
                            <>
                                <div className="px-4 py-2 bg-gray-50">
                                    <span className="text-xs font-medium text-gray-500">EARLIER</span>
                                </div>
                                {notifications.filter(n => n.read).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors opacity-75"
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-700">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-400">{notification.time}</span>
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

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
                <Link
                    href={`/${user?.role}/notifications`}
                    className="block text-center text-sm text-blue-500 hover:text-blue-600 font-medium"
                    onClick={onClose}
                >
                    View All Notifications
                </Link>
            </div>
        </div>
    );
}