// src/app/applicant/portal/layout.tsx
import type { Metadata } from "next";
import { ApplicantNav } from "@/components/applicant/ApplicantNav";
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
    title: "Applicant Portal - LearnScape LMS",
    description: "Manage your application for Brightfield Primary School",
};

export default function ApplicantPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ApplicantNav />
            <main className="min-h-screen pt-16 bg-gray-50">
                {children}
            </main>
            <Footer />
        </>
    );
}