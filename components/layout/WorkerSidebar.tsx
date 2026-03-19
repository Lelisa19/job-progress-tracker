"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkerSidebar() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log("✅ WorkerSidebar MOUNTED");
    }, []);

    const menuItems = [
        "Dashboard",
        "My Tasks",
        "Attendance",
        "Payments"
    ];

    const getPath = (item: string) => {
        switch (item) {
            case "Dashboard": return "/worker/dashboard";
            case "My Tasks": return "/worker/my-tasks";
            case "Attendance": return "/worker/attendance";
            case "Payments": return "/worker/payments";
            default: return "/worker/dashboard";
        }
    };

    if (!mounted) {
        return <div className="w-64 border-r border-gray-200 bg-white">Loading sidebar...</div>;
    }

    return (
        <aside className="w-64 border-r border-gray-200 bg-white h-screen sticky top-0">
            {/* Add a visible marker */}
            <div className="p-2 bg-green-500 text-white text-xs text-center">
                WORKER SIDEBAR ACTIVE
            </div>

            <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setActiveTab(item);
                            router.push(getPath(item));
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${activeTab === item
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </nav>
        </aside>
    );
}