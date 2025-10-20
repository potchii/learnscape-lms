import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await requireSession(["STUDENT", "ADMIN"]);

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const assignmentId = formData.get("assignmentId") as string;
        const studentId = formData.get("studentId") as string;

        if (!file || !assignmentId || !studentId) {
            return NextResponse.json(
                { error: "File, assignment ID, and student ID are required" },
                { status: 400 }
            );
        }

        // Verify the assignment exists and is still open
        const assignment = await prisma.assignment.findFirst({
            where: {
                id: assignmentId,
                status: "PUBLISHED",
            },
        });

        if (!assignment) {
            return NextResponse.json(
                { error: "Assignment not found" },
                { status: 404 }
            );
        }

        // Verify the student exists and has access to this assignment
        const student = await prisma.student.findFirst({
            where: {
                id: studentId,
                userId: session.user.id,
            },
            include: {
                section: {
                    include: {
                        classes: true,
                    },
                },
            },
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student record not found" },
                { status: 404 }
            );
        }

        // Check if student has access to this assignment
        const hasAccess = student.section.classes.some(
            (classItem) => classItem.id === assignment.classId
        );

        if (!hasAccess) {
            return NextResponse.json(
                { error: "You don't have access to this assignment" },
                { status: 403 }
            );
        }

        // Upload file to Vercel Blob
        const blob = await put(`assignments/${assignmentId}/${studentId}/${file.name}`, file, {
            access: 'public',
        });

        // Create or update submission record
        const now = new Date();
        const isLate = now > assignment.dueDate;

        const submission = await prisma.assignmentSubmission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId,
                    studentId,
                },
            },
            update: {
                fileUrl: blob.url,
                submittedAt: now,
                status: isLate ? "LATE" : "SUBMITTED",
            },
            create: {
                assignmentId,
                studentId,
                fileUrl: blob.url,
                submittedAt: now,
                status: isLate ? "LATE" : "SUBMITTED",
            },
        });

        return NextResponse.json({
            success: true,
            submission: {
                id: submission.id,
                fileUrl: submission.fileUrl,
                submittedAt: submission.submittedAt,
                status: submission.status,
            },
        });

    } catch (error: any) {
        console.error("Assignment submission error:", error);
        return NextResponse.json(
            { error: error.message || "Submission failed" },
            { status: 500 }
        );
    }
}