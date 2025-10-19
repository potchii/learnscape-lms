import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: {
        id: string;
    };
}

// GET - Fetch specific section with class and teacher details
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await requireSession("ADMIN");

        const section = await prisma.section.findUnique({
            where: { id: params.id },
            include: {
                students: {
                    select: { id: true }
                },
                classes: {
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
                },
            },
        });

        if (!section) {
            return NextResponse.json(
                { error: "Section not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ section });
    } catch (error) {
        console.error("Error fetching section:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Add new class to section
export async function POST(request: Request, { params }: RouteParams) {
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

        // Check if section exists
        const section = await prisma.section.findUnique({
            where: { id: params.id },
        });

        if (!section) {
            return NextResponse.json(
                { error: "Section not found" },
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

        // Check if class already exists in this section
        const existingClass = await prisma.class.findFirst({
            where: {
                sectionId: params.id,
                subjectName: subjectName.trim(),
            },
        });

        if (existingClass) {
            return NextResponse.json(
                { error: `Class "${subjectName}" already exists in this section` },
                { status: 400 }
            );
        }

        // Create the class
        const newClass = await prisma.class.create({
            data: {
                subjectName: subjectName.trim(),
                sectionId: params.id,
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

        return NextResponse.json(
            {
                message: `Class "${subjectName}" created successfully`,
                class: newClass,
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating class:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update section (keep your existing code)
export async function PUT(request: Request, { params }: RouteParams) {
    // ... your existing PUT code remains the same ...
}

// DELETE - Delete section (keep your existing code)
export async function DELETE(request: Request, { params }: RouteParams) {
    // ... your existing DELETE code remains the same ...
}