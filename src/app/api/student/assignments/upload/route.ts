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

        if (!file || !assignmentId) {
            return NextResponse.json(
                { error: "File and assignment ID are required" },
                { status: 400 }
            );
        }

        // Verify the assignment exists and is still open
        const assignment = await prisma.assignment.findFirst({
            where: {
                id: assignmentId,
                status: "PUBLISHED",
                dueDate: {
                    gt: new Date(), // Assignment not yet due
                },
            },
        });

        if (!assignment) {
            return NextResponse.json(
                { error: "Assignment not found or submission closed" },
                { status: 404 }
            );
        }

        // Get student record
        const student = await prisma.student.findFirst({
            where: { userId: session.user.id },
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student record not found" },
                { status: 404 }
            );
        }

        // Upload file to Vercel Blob
        const blob = await put(`assignments/${assignmentId}/${student.id}/${file.name}`, file, {
            access: 'public',
        });

        // Create or update submission record
        const submission = await prisma.assignmentSubmission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId,
                    studentId: student.id,
                },
            },
            update: {
                fileUrl: blob.url,
                submittedAt: new Date(),
                status: new Date() > assignment.dueDate ? "LATE" : "SUBMITTED",
            },
            create: {
                assignmentId,
                studentId: student.id,
                fileUrl: blob.url,
                submittedAt: new Date(),
                status: new Date() > assignment.dueDate ? "LATE" : "SUBMITTED",
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
        console.error("File upload error:", error);
        return NextResponse.json(
            { error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}