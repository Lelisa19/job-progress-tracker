"use client"; // This is required because we are reading the current URL path

import Link from "next/link";
import { usePathname } from "next/navigation";

const employerRoutes = [
  { label: "Dashboard", href: "/employer/dashboard", icon: "🏠" },
  { label: "Workers", href: "/employer/workers", icon: "👥" },
  { label: "Projects", href: "/employer/projects", icon: "📁" },
  { label: "Tasks", href: "/employer/tasks", icon: "✅" },
  { label: "Attendance", href: "/employer/attendance", icon: "🕒" },
  { label: "Payments", href: "/employer/payments", icon: "💰" },
  { label: "Reports", href: "/employer/reports", icon: "📊" },
  { label: "Settings", href: "/employer/settings", icon: "⚙️" },
];

export default function Sidebar() {
  // Grab the current URL path (e.g., "/employer/dashboard")
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow flex flex-col min-h-screen">
      <nav className="flex-1 p-4 space-y-2">
        {employerRoutes.map((route) => {
          // Check if the current route matches this link's href
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.label}
              href={route.href}
              className={`flex items-center p-2 rounded-lg font-medium transition-colors ${isActive
                  ? "bg-[#eff6ff] text-[#2563eb]" // Active State (Blue text and background)
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50" // Inactive State 
                }`}
            >
              <span className="text-lg mr-3 text-current">{route.icon}</span>
              {route.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
