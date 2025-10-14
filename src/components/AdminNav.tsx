// src/components/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function AdminNav() {
    const pathname = usePathname() || "/";

    const nav = [
        { label: "Users", href: "/admin/dashboard" },
        { label: "Applications", href: "/admin/applications" },
        { label: "Settings", href: "/admin/settings" },
    ];

    return (
        <div className="w-full">
            <nav className="bg-white border-b shadow-sm px-8 py-3 flex items-center gap-6">
                {/* left: brand + links */}
                <div className="flex items-center gap-8">
                    <Link href="/admin/dashboard" className="text-lg font-semibold text-blue-600">
                        LearnScape Admin
                    </Link>

                    <ul className="flex items-center gap-4 text-sm">
                        {nav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={
                                            "px-2 py-1 rounded-sm transition-colors " +
                                            (isActive
                                                ? "text-blue-600 font-medium border-b-2 border-blue-600"
                                                : "text-gray-700 hover:text-blue-600")
                                        }
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* spacer to push logout to the far right */}
                <div className="ml-auto flex items-center">
                    <LogoutButton />
                </div>
            </nav>
        </div>
    );
}
