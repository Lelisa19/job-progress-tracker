"use client";

import React from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const name = user?.name ?? "—";
  const roleLabel = user?.role === "worker" ? "Worker" : "Employer";
  const initials =
    user?.initials ??
    name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-gray-200/80 bg-white px-6">
      <div className="flex items-center gap-4">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </span>
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-full border border-gray-200 object-cover shadow-sm"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-sm"
              aria-hidden
            >
              {initials}
            </div>
          )}
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
