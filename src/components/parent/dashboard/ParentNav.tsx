import Link from "next/link";
import { getCurrentSession } from "@/lib/session";
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
import { AlertService } from "@/lib/alert-service";

const navigation = [
    { name: 'Home', href: '/parent/dashboard', icon: Home },
    { name: 'Students', href: '/parent/students', icon: Users },
    { name: 'Schedule', href: '/parent/schedule', icon: Calendar },
    { name: 'Assignments', href: '/parent/assignments', icon: FileText },
    { name: 'Alerts', href: '/parent/alerts', icon: Bell },
];

export async function ParentNav() {
    const session = await getCurrentSession();

    let unreadCount = 0;

    // Only fetch alert count if user is a parent
    if (session?.user.role === 'PARENT') {
        try {
            const parent = await getCurrentSession();
            unreadCount = await AlertService.getUnreadAlertCount(parent.id);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }

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
                                const isActive = false; // We'll handle active state on client if needed

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
                                            "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4 mr-2" />
                                        {item.name}
                                        {item.name === 'Alerts' && unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
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
                        const isActive = false; // We'll handle active state on client if needed

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md transition-colors min-w-[60px] relative",
                                    "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                <item.icon className="h-4 w-4 mb-1" />
                                {item.name}
                                {item.name === 'Alerts' && unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}