// src/app/student/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StudentNav } from "@/components/student/dashboard/StudentNav";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Student Portal - LearnScape LMS",
    description: "Student learning management system",
};

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 flex flex-col`}>
            <StudentNav />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}