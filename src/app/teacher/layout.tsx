// src/app/teacher/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TeacherNav } from "@/components/teacher/TeacherNav";
import { Footer } from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LearnScape - Teacher Portal",
    description: "Teacher portal for LearnScape LMS",
};

// src/app/teacher/layout.tsx
export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        // Remove <html> and <body> tags - just return the content directly
        <div className={`${geist.className} ${geistMono.className} min-h-screen bg-gray-50`}>
            <TeacherNav />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </div>
    );
}