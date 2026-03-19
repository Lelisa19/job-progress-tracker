"use client";
import React from "react";
import Sidebar from "../../components/layout/EmployerSidebar";
import WorkerSidebar from "../../components/layout/WorkerSidebar";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isWorker = pathname?.startsWith('/worker');

  return (
    <div className="flex min-h-screen">
      {isWorker ? <WorkerSidebar /> : <Sidebar />}
      <div className="flex-1 flex flex-col">
        <main className="p-6 flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}