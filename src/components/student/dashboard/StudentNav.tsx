// src/app/student/StudentNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export function StudentNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/student", label: "Home", icon: "🏠" },
        { href: "/student/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/student/subjects", label: "My Subjects", icon: "📚" },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Main Navigation */}
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">LearnScape</span>
                        </div>

                        <div className="hidden md:flex space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === item.href
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <LogoutButton />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${pathname === item.href
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}