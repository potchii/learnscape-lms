// src/components/applicant/ApplicantNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import {
    User,
    FileText,
    Home,
    Clock
} from "lucide-react";

export function ApplicantNav() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Dashboard",
            href: "/applicant/portal",
            icon: Home,
        },
        {
            name: "Application",
            href: "/applicant/portal/application",
            icon: FileText,
        },
        {
            name: "Profile",
            href: "/applicant/portal/profile",
            icon: User,
        },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link href="/applicant/portal" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">LearnScape</span>
                            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                                Applicant Portal
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        <LogoutButton />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-200">
                    <div className="flex space-x-1 py-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex-1 flex flex-col items-center px-2 py-1 rounded-md text-xs font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 mb-1" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}