import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await requireSession(['STUDENT']);

        console.log("🔍 [DEBUG] Session user ID:", session.user.id);

        // Check if user exists and has student record
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                student: true
            }
        });

        console.log("🔍 [DEBUG] User found:", !!user);
        console.log("🔍 [DEBUG] Student record:", user?.student);

        if (!user) {
            return NextResponse.json({
                error: "User not found",
                sessionUserId: session.user.id
            }, { status: 404 });
        }

        if (!user.student) {
            return NextResponse.json({
                error: "Student record not found for user",
                userId: session.user.id,
                userRole: user.role,
                userEmail: user.email
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            },
            student: {
                id: user.student.id,
                studentNumber: user.student.studentNumber
            }
        });
    } catch (error) {
        console.error("Student debug error:", error);
        return NextResponse.json({
            error: "Student debug failed",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}