"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JobTrackerMark } from "./JobTrackerMark";

const employerRoutes = [
  { label: "Dashboard", href: "/employer/dashboard" },
  { label: "Workers", href: "/employer/workers" },
  { label: "Projects", href: "/employer/projects" },
  { label: "Tasks", href: "/employer/tasks" },
  { label: "Attendance", href: "/employer/attendance" },
  { label: "Payments", href: "/employer/payments" },
  { label: "Reports", href: "/employer/reports" },
  { label: "Settings", href: "/employer/settings" },
];

export default function EmployerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-6">
        <JobTrackerMark />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {employerRoutes.map((route) => {
          const isActive =
            pathname === route.href ||
            (route.href !== "/employer/dashboard" &&
              pathname?.startsWith(route.href));

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`block rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors ${
                isActive
                  ? "bg-[#EFF6FF] text-[#3B82F6]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {route.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
