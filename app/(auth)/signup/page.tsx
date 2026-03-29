"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

function SignupContent() {
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

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const name = String(formData.get("fullName") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const phone = String(formData.get("phone") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const confirm = String(formData.get("confirmPassword") ?? "");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setPending(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password, role }),
                credentials: "include",
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || "Registration failed");
                setPending(false);
                return;
            }
            await refreshUser();
            router.push(role === "employer" ? "/employer/dashboard" : "/worker/dashboard");
        } catch {
            setError("Network error.");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] py-8">
            <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-10 py-12 my-8">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-[#2563eb] rounded-[14px] flex items-center justify-center shadow-sm transition-all duration-300">
                        {role === 'employer' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        )}
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Create an account</h1>
                    <p className="text-[15px] text-gray-500 mt-2">Sign up for JobTracker</p>
                </div>

                {/* Role Toggle */}
                <div className="flex p-1 bg-[#f1f5f9] rounded-[10px] mb-8">
                    <button
                        type="button"
                        onClick={() => setRole('employer')}
                        className={`flex-1 rounded-md py-2.5 text-[14px] font-semibold transition-colors ${role === 'employer'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Employer
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('worker')}
                        className={`flex-1 rounded-md py-2.5 text-[14px] font-semibold transition-colors ${role === 'worker'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Worker
                    </button>
                </div>

                {/* Form */}
                {error && (
                    <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                )}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            placeholder="John Doe"
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="name@company.com"
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="+1 (555) 123-4567"
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="••••••••"
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="••••••••"
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="mt-4 w-full rounded-xl bg-[#2563eb] px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60"
                    >
                        {pending ? "Creating account…" : "Sign up"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-[#9ca3af]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[#2563eb] hover:text-blue-500">
                        Log in
                    </Link>
                </p>

                {/* Role-specific info */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                        {role === 'employer'
                            ? 'Create an employer account to manage workers, track projects, and handle payments.'
                            : 'Create a worker account to track your attendance, view tasks, and manage your earnings.'}
                    </p>
                </div>

            </div>
        </div>
    );
}

// Suspense boundary to allow next/navigation standard SSR handling
export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
                <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SignupContent />
        </Suspense>
    );
}