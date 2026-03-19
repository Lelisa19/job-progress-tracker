// app/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
    name: string;
    role: 'employer' | 'worker';
    initials: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (role: 'employer' | 'worker', userData: Partial<User>) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const checkAuth = () => {
            try {
                // Check cookies first (more reliable for SSR)
                const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                    const [key, value] = cookie.trim().split('=');
                    acc[key] = value;
                    return acc;
                }, {} as Record<string, string>);

                if (cookies.userRole) {
                    setUser({
                        role: cookies.userRole as 'employer' | 'worker',
                        name: cookies.userName || (cookies.userRole === 'employer' ? 'John Anderson' : 'Carlos Rodriguez'),
                        initials: cookies.userInitials || (cookies.userRole === 'employer' ? 'JA' : 'CR')
                    });
                } else {
                    // Fallback to localStorage
                    const storedRole = localStorage.getItem('userRole');
                    if (storedRole) {
                        setUser({
                            role: storedRole as 'employer' | 'worker',
                            name: localStorage.getItem('userName') || (storedRole === 'employer' ? 'John Anderson' : 'Carlos Rodriguez'),
                            initials: localStorage.getItem('userInitials') || (storedRole === 'employer' ? 'JA' : 'CR')
                        });
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (role: 'employer' | 'worker', userData: Partial<User>) => {
        const newUser = {
            role,
            name: userData.name || (role === 'employer' ? 'John Anderson' : 'Carlos Rodriguez'),
            initials: userData.initials || (role === 'employer' ? 'JA' : 'CR')
        };

        setUser(newUser);

        // Store in both cookie and localStorage
        document.cookie = `userRole=${role}; path=/; max-age=86400`;
        document.cookie = `userName=${newUser.name}; path=/; max-age=86400`;
        document.cookie = `userInitials=${newUser.initials}; path=/; max-age=86400`;

        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', newUser.name);
        localStorage.setItem('userInitials', newUser.initials);
    };

    const logout = () => {
        setUser(null);

        // Clear cookies
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'userName=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'userInitials=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

        // Clear localStorage
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userInitials');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}