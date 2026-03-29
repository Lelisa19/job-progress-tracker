"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JobTrackerMark } from "./JobTrackerMark";

const menuItems: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/worker/dashboard" },
  { label: "My Tasks", href: "/worker/tasks" },
  { label: "Attendance", href: "/worker/attendance" },
  { label: "Payments", href: "/worker/payments" },
  { label: "Profile", href: "/worker/profile" },
];

export default function WorkerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-6">
        <JobTrackerMark />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/worker/dashboard" &&
              pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors ${
                isActive
                  ? "bg-[#EFF6FF] text-[#3B82F6]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
