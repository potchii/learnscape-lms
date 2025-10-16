import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: {
        id: string;
    };
}

// GET - Fetch specific section
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
                    select: { id: true }
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

// PUT - Update section
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await requireSession("ADMIN");

        const { gradeLevel, name } = await request.json();

        // Validate required fields
        if (!gradeLevel || !name?.trim()) {
            return NextResponse.json(
                { error: "Grade level and section name are required" },
                { status: 400 }
            );
        }

        // Validate grade level
        const grade = parseInt(gradeLevel);
        if (grade < 1 || grade > 6) {
            return NextResponse.json(
                { error: "Grade level must be between 1 and 6" },
                { status: 400 }
            );
        }

        // Check if section exists
        const existingSection = await prisma.section.findUnique({
            where: { id: params.id },
        });

        if (!existingSection) {
            return NextResponse.json(
                { error: "Section not found" },
                { status: 404 }
            );
        }

        // Check if section with same name already exists in this grade
        const duplicateSection = await prisma.section.findFirst({
            where: {
                gradeLevel: grade,
                name: name.trim(),
                id: { not: params.id }, // Exclude current section
            },
        });

        if (duplicateSection) {
            return NextResponse.json(
                { error: `Section "${name}" already exists for Grade ${grade}` },
                { status: 400 }
            );
        }

        // Update the section
        const updatedSection = await prisma.section.update({
            where: { id: params.id },
            data: {
                gradeLevel: grade,
                name: name.trim(),
            },
            include: {
                students: {
                    select: { id: true }
                },
                classes: {
                    select: { id: true }
                },
            },
        });

        return NextResponse.json(
            {
                message: `Section updated successfully: Grade ${grade} - ${name}`,
                section: updatedSection
            }
        );

    } catch (error: any) {
        console.error("Error updating section:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete section
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await requireSession("ADMIN");

        // Check if section exists and get its dependencies
        const section = await prisma.section.findUnique({
            where: { id: params.id },
            include: {
                students: {
                    select: { id: true }
                },
                classes: {
                    select: { id: true }
                },
            },
        });

        if (!section) {
            return NextResponse.json(
                { error: "Section not found" },
                { status: 404 }
            );
        }

        // Check if section has students or classes
        if (section.students.length > 0 || section.classes.length > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete section with assigned students or classes",
                    details: {
                        students: section.students.length,
                        classes: section.classes.length
                    }
                },
                { status: 400 }
            );
        }

        // Delete the section
        await prisma.section.delete({
            where: { id: params.id },
        });

        return NextResponse.json(
            {
                message: `Section deleted successfully: Grade ${section.gradeLevel} - ${section.name}`,
            }
        );

    } catch (error: any) {
        console.error("Error deleting section:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}