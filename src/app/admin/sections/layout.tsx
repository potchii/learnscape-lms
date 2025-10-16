// src/app/admin/dashboard/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AdminNav from "@/components/AdminNav";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
    title: "Sections | LearnScape Admin",
    description: "Administrative interface for managing applications",
};

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${geist.variable} font-sans min-h-screen bg-gray-50`}>
            {/* client-side nav */}
            <AdminNav />

            {/* Page content */}
            <main className="p-10">{children}</main>
        </div>
    );
}
