import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ParentNav } from "@/components/parent/dashboard/ParentNav";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: "Parent Dashboard - LearnScape",
    description: "Monitor your children's academic progress",
};

export default function ParentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${geist.variable} ${geistMono.variable} font-sans`}>
            <ParentNav />
            <main>{children}</main>
        </div>
    );
}