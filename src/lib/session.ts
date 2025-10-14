import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Safely get the current user session with correct typing.
 * Returns `Session | null` when not logged in.
 */
export async function getCurrentSession(): Promise<Session | null> {
    const session = await getServerSession(authOptions);
    return session as Session | null;
}

/**
 * Requires a logged-in session and optionally one or more allowed roles.
 * If not authenticated or not authorized, automatically redirects.
 */
export async function requireSession(allowedRoles?: string | string[]): Promise<Session> {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session) {
        redirect("/login");
    }

    // Normalize allowedRoles to an array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Check if user's role is allowed
    if (allowedRoles && !roles.includes(session.user.role)) {
        redirect("/unauthorized");
    }

    return session;
}

/**
 * Redirects users to their role-based dashboard.
 */
export async function redirectToDashboard(role: string) {
    switch (role) {
        case "ADMIN":
            redirect("/admin/dashboard");
        case "TEACHER":
            redirect("/teacher/dashboard");
        case "PARENT":
            redirect("/parent/dashboard");
        case "STUDENT":
            redirect("/student/dashboard");
        case "APPLICANT":
            redirect("/applicant/portal");
        default:
            redirect("/unauthorized");
    }
}

