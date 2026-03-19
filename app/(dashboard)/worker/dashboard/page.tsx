"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function WorkerDashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Carlos! Here is your daily summary.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Daily Attendance & Payment Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Daily Attendance Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Daily Attendance</h3>

            <div className="text-3xl font-bold text-gray-900 mb-2">08:45 AM</div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-600">GPS Verified: Downtown Site</span>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg transition-colors">
              Check In Now
            </button>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Payment Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Earnings</span>
                <span className="text-lg font-semibold text-gray-900">$1,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Paid</span>
                <span className="text-lg font-semibold text-green-600">$850</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Unpaid</span>
                <span className="text-lg font-semibold text-amber-600">$400</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - My Assigned Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Assigned Tasks Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">My Assigned Tasks</h3>

            <div className="space-y-4">
              {/* Task 1 - In Progress */}
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">Site Preparation & Clearing</h4>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">In Progress</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Project Alpha</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Due: Today, 5:00 PM</span>
                </div>
              </div>

              {/* Task 2 - Not Started */}
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">Material Unloading</h4>
                  <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full">To Do</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">Downtown Site</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Due: Tomorrow</span>
                </div>
              </div>

              {/* Task 3 - Not Started */}
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">Safety Briefing Attendance</h4>
                  <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full">To Do</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">General</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Due: Oct 12</span>
                </div>
              </div>
            </div>

            {/* View All Tasks Link */}
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Tasks →
            </button>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Notifications</h3>

            <div className="space-y-4">
              {/* Notification 1 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-600 text-sm">
                  💰
                </div>
                <div>
                  <p className="text-sm text-gray-800">Payment of $450 processed for Week 40.</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>

              {/* Notification 2 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-blue-600 text-sm">
                  📋
                </div>
                <div>
                  <p className="text-sm text-gray-800">New task Material Unloading assigned to you.</p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
              </div>

              {/* Notification 3 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-600 text-sm">
                  📍
                </div>
                <div>
                  <p className="text-sm text-gray-800">Please verify your GPS location for tomorrow's shift.</p>
                  <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                </div>
              </div>
            </div>

            {/* View All Link */}
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}