"use client";

import React from "react";

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header with Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Workers */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-400 mb-1">Total Workers</div>
          <div className="text-3xl font-bold text-gray-900">142</div>
          <div className="flex items-center mt-2">
            <span className="text-xs font-medium text-emerald-600">+12%</span>
            <span className="text-xs text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-400 mb-1">Active Projects</div>
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500">2 completing this week</span>
          </div>
        </div>

        {/* Tasks Today */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-400 mb-1">Tasks Today</div>
          <div className="text-3xl font-bold text-gray-900">45</div>
          <div className="flex items-center mt-2">
            <span className="text-xs font-medium text-emerald-600">28 completed</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-400 mb-1">Pending Payments</div>
          <div className="text-3xl font-bold text-gray-900">$4,250</div>
          <div className="flex items-center mt-2">
            <span className="text-xs font-medium text-amber-600">Due in 3 days</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview - Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Attendance Overview</h3>
            <button className="text-sm text-gray-400 hover:text-gray-600">This Week</button>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-40 mb-4">
            {[
              { day: "Mon", present: 85, absent: 25 },
              { day: "Tue", present: 90, absent: 20 },
              { day: "Wed", present: 65, absent: 40 },
              { day: "Thu", present: 95, absent: 15 },
              { day: "Fri", present: 80, absent: 30 },
              { day: "Sat", present: 45, absent: 60 }
            ].map((item) => (
              <div key={item.day} className="flex flex-col items-center w-12">
                <div className="flex items-end gap-1">
                  <div className="w-4 bg-blue-600 rounded-t" style={{ height: `${item.present}px` }}></div>
                  <div className="w-4 bg-gray-200 rounded-t" style={{ height: `${item.absent}px` }}></div>
                </div>
                <span className="text-xs text-gray-400 mt-2">{item.day}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
              <span className="text-xs text-gray-500">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
              <span className="text-xs text-gray-500">Absent/Leave</span>
            </div>
          </div>
        </div>

        {/* Task Completion - Donut Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Task Completion</h3>

          {/* Simple Donut Chart */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-4">
              {/* Background circle (To Do) */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              {/* In Progress (orange) - 20% */}
              <div className="absolute inset-0 rounded-full border-8 border-orange-500" style={{ clipPath: "polygon(50% 50%, 50% 0%, 70% 0%, 70% 0%)" }}></div>
              {/* Done (blue) - 65% */}
              <div className="absolute inset-0 rounded-full border-8 border-blue-600" style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 65%)" }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">65%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <span className="text-xs text-gray-500">Done</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-500">In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                <span className="text-xs text-gray-500">To Do</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-gray-900">Latest Notifications</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
        </div>

        <div className="space-y-4">
          {/* Notification 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-800">David Smith missed check-in at Downtown Site.</p>
              <p className="text-xs text-gray-400 mt-1">10 mins ago</p>
            </div>
          </div>

          {/* Notification 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-800">Project Alpha Phase 1 has been marked as completed.</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>

          {/* Notification 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-800">Weekly attendance report is ready to download.</p>
              <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}