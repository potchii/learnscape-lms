// src/components/teacher/TeacherNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export function TeacherNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/teacher", label: "Home", icon: "🏠" },
        { href: "/teacher/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/teacher/classes", label: "My Classes", icon: "📚" },
        { href: "/teacher/gradebook", label: "Gradebook", icon: "📝" },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/teacher" className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-blue-600">LearnScape</span>
                            <span className="text-sm text-gray-500">Teacher</span>
                        </Link>

                        <div className="hidden md:flex space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.href
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}