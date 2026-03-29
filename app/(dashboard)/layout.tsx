"use client";

import React from "react";
import { usePathname } from "next/navigation";
import EmployerSidebar from "../../components/layout/EmployerSidebar";
import WorkerSidebar from "../../components/layout/WorkerSidebar";
import DashboardHeader from "../../components/layout/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isWorker = pathname?.startsWith("/worker");

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {isWorker ? <WorkerSidebar /> : <EmployerSidebar />}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}