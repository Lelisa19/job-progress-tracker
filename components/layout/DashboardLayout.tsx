// components/layout/DashboardLayout.tsx
"use client";

import React from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Sidebar from "./EmployerSidebar";
import WorkerSidebar from "./WorkerSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Show sidebar based on user role from auth context */}
      {user?.role === 'worker' ? <WorkerSidebar /> : <Sidebar />}

      <div className="flex-1 flex flex-col">
        <main className="p-6 flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}