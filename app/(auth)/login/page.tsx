
"use client";

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [role, setRole] = useState<'employer' | 'worker'>('employer');

    // Handle form submission routing
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Store the role in localStorage and/or cookie
        localStorage.setItem('userRole', role);
        document.cookie = `userRole=${role}; path=/; max-age=86400`; // 24 hours

        // Also store user info (mock data - replace with actual API response)
        const userData = role === 'employer'
            ? { name: 'John Anderson', initials: 'JA' }
            : { name: 'Carlos Rodriguez', initials: 'CR' };

        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userInitials', userData.initials);
        document.cookie = `userName=${userData.name}; path=/; max-age=86400`;
        document.cookie = `userInitials=${userData.initials}; path=/; max-age=86400`;

        // Redirect based on role
        if (role === 'employer') {
            router.push('/employer/dashboard');
        } else {
            router.push('/worker/dashboard');
        }
    };

    // Once the component loads on the client, read the parameter and set the toggle state
    useEffect(() => {
        const urlRole = searchParams.get('role');
        if (urlRole === 'worker' || urlRole === 'employer') {
            setRole(urlRole);
        }
    }, [searchParams]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
            <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-10 py-12">

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
                    <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Welcome back</h1>
                    <p className="text-[15px] text-gray-500 mt-2">Log in to your JobTracker account</p>
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
                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                            Email or Phone Number
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="email"
                            required
                            placeholder="name@company.com"
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                                Password
                            </label>
                            <Link href="#" className="text-sm font-semibold text-[#2563eb] hover:text-blue-500">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            defaultValue="••••••••"
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] transition-colors font-mono tracking-widest"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#2563eb] px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors mt-2"
                    >
                        Log in
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-[#9ca3af]">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-[#2563eb] hover:text-blue-500">
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
}

// Wrapping in Suspense enables reading searchParams without halting Next.js SSR functions!
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
                <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
