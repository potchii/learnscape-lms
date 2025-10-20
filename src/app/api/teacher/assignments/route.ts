import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        await requireSession(["TEACHER", "ADMIN"]);

        const { title, description, classId, dueDate, maxScore, teacherId } = await request.json();

        // Validate required fields
        if (!title?.trim() || !classId || !dueDate || !teacherId) {
            return NextResponse.json(
                { error: "Title, class, due date, and teacher are required" },
                { status: 400 }
            );
        }

        // Verify the teacher teaches this class
        const classItem = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: teacherId,
            },
        });

        if (!classItem) {
            return NextResponse.json(
                { error: "Class not found or access denied" },
                { status: 403 }
            );
        }

        // Create the assignment
        const assignment = await prisma.assignment.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                dueDate: new Date(dueDate),
                maxScore: maxScore ? parseInt(maxScore) : null,
                classId,
                teacherId,
                status: "PUBLISHED",
            },
            include: {
                class: {
                    include: {
                        section: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                message: "Assignment created successfully",
                assignment: {
                    id: assignment.id,
                    title: assignment.title,
                    dueDate: assignment.dueDate,
                    class: assignment.class.subjectName,
                    section: `Grade ${assignment.class.section.gradeLevel} ${assignment.class.section.name}`,
                },
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating assignment:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}