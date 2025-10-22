'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import {
    Home,
    Users,
    Calendar,
    FileText,
    Bell,
    School
} from "lucide-react";

const navigation = [
    { name: 'Home', href: '/parent/dashboard', icon: Home },
    { name: 'Students', href: '/parent/students', icon: Users },
    { name: 'Schedule', href: '/parent/schedule', icon: Calendar },
    { name: 'Assignments', href: '/parent/assignments', icon: FileText },
    { name: 'Alerts', href: '/parent/alerts', icon: Bell },
];

export function ParentNav() {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Main Navigation */}
                    <div className="flex items-center">
                        <Link href="/parent/dashboard" className="flex items-center space-x-2">
                            <School className="h-8 w-8 text-blue-600" />
                            <span className="font-bold text-xl text-gray-900">LearnScape</span>
                            <span className="text-sm text-gray-500">Parent</span>
                        </Link>

                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/parent/dashboard' && pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                            isActive
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4 mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Menu and Logout */}
                    <div className="flex items-center space-x-4">
                        <LogoutButton />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200">
                <div className="flex overflow-x-auto py-2 px-4 space-x-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/parent/dashboard' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md transition-colors min-w-[60px]",
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                <item.icon className="h-4 w-4 mb-1" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}