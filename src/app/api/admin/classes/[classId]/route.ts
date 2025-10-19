import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: {
        id: string;
        classId: string;
    };
}

// PUT - Update class
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await requireSession("ADMIN");

        const { subjectName, teacherId, schedule } = await request.json();

        // Validate required fields
        if (!subjectName?.trim() || !teacherId) {
            return NextResponse.json(
                { error: "Subject name and teacher are required" },
                { status: 400 }
            );
        }

        // Check if class exists and belongs to this section
        const existingClass = await prisma.class.findFirst({
            where: {
                id: params.classId,
                sectionId: params.id,
            },
        });

        if (!existingClass) {
            return NextResponse.json(
                { error: "Class not found in this section" },
                { status: 404 }
            );
        }

        // Check if teacher exists
        const teacher = await prisma.teacher.findUnique({
            where: { id: teacherId },
        });

        if (!teacher) {
            return NextResponse.json(
                { error: "Teacher not found" },
                { status: 404 }
            );
        }

        // Check for duplicate class name in this section
        const duplicateClass = await prisma.class.findFirst({
            where: {
                sectionId: params.id,
                subjectName: subjectName.trim(),
                id: { not: params.classId },
            },
        });

        if (duplicateClass) {
            return NextResponse.json(
                { error: `Class "${subjectName}" already exists in this section` },
                { status: 400 }
            );
        }

        // Update the class
        const updatedClass = await prisma.class.update({
            where: { id: params.classId },
            data: {
                subjectName: subjectName.trim(),
                teacherId: teacherId,
                schedule: schedule?.trim() || null,
            },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            message: "Class updated successfully",
            class: updatedClass,
        });

    } catch (error: any) {
        console.error("Error updating class:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete class
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await requireSession("ADMIN");

        // Check if class exists and belongs to this section
        const classItem = await prisma.class.findFirst({
            where: {
                id: params.classId,
                sectionId: params.id,
            },
            include: {
                attendance: {
                    select: { id: true }
                },
                grades: {
                    select: { id: true }
                },
            },
        });

        if (!classItem) {
            return NextResponse.json(
                { error: "Class not found in this section" },
                { status: 404 }
            );
        }

        // Check if class has dependencies
        if (classItem.attendance.length > 0 || classItem.grades.length > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete class with attendance or grade records",
                    details: {
                        attendance: classItem.attendance.length,
                        grades: classItem.grades.length,
                    },
                },
                { status: 400 }
            );
        }

        // Delete the class
        await prisma.class.delete({
            where: { id: params.classId },
        });

        return NextResponse.json({
            message: "Class deleted successfully",
        });

    } catch (error: any) {
        console.error("Error deleting class:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}