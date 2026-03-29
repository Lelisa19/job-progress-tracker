"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

/**
 * Login flow (learning notes):
 * 1. User submits email + password; we POST to a Route Handler (`/api/auth/login`).
 * 2. The server checks MongoDB, compares the password with bcrypt, then signs a JWT.
 * 3. The JWT is stored in an httpOnly cookie (JavaScript cannot read it — XSS-safe).
 * 4. `AuthContext.refreshUser()` calls `/api/auth/me`, which reads the cookie server-side
 *    and returns JSON for the UI.
 */
function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [role, setRole] = useState<"employer" | "worker">("employer");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const urlRole = searchParams.get("role");
    if (urlRole === "worker" || urlRole === "employer") {
      setRole(urlRole);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        setPending(false);
        return;
      }
      await refreshUser();
      router.push(role === "employer" ? "/employer/dashboard" : "/worker/dashboard");
    } catch {
      setError("Network error — is the dev server running?");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8]">
      <div className="w-full max-w-[440px] rounded-2xl bg-white px-10 py-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#2563eb] shadow-sm transition-all duration-300">
            {role === "employer" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-[26px] font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            Log in to your JobTracker account
          </p>
        </div>

        <div className="mb-8 flex rounded-[10px] bg-[#f1f5f9] p-1">
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`flex-1 rounded-md py-2.5 text-[14px] font-semibold transition-colors ${
              role === "employer"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Employer
          </button>
          <button
            type="button"
            onClick={() => setRole("worker")}
            className={`flex-1 rounded-md py-2.5 text-[14px] font-semibold transition-colors ${
              role === "worker"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Worker
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@company.com"
              className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] transition-colors focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900"
              >
                Password
              </label>
              <span className="text-sm font-semibold text-[#9ca3af]">
                Forgot password?
              </span>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] transition-colors focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-xl bg-[#2563eb] px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#9ca3af]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#2563eb] hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
