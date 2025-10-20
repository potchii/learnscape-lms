import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

// GET - Fetch all sections
export async function GET(request: NextRequest) {
    try {
        await requireSession("ADMIN");

        const sections = await prisma.section.findMany({
            include: {
                students: {
                    select: { id: true }
                },
                classes: {
                    select: { id: true }
                },
            },
            orderBy: [
                { gradeLevel: 'asc' },
                { name: 'asc' },
            ],
        });

        return NextResponse.json({ sections });
    } catch (error: any) {
        console.error("Error fetching sections:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new section
export async function POST(request: NextRequest) {
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

        // Check if section already exists
        const existingSection = await prisma.section.findFirst({
            where: {
                gradeLevel: grade,
                name: name.trim(),
            },
        });

        if (existingSection) {
            return NextResponse.json(
                { error: `Section "${name}" already exists for Grade ${grade}` },
                { status: 400 }
            );
        }

        // Create the section
        const section = await prisma.section.create({
            data: {
                gradeLevel: grade,
                name: name.trim(),
            },
        });

        return NextResponse.json(
            {
                message: `Section created successfully: Grade ${grade} - ${name}`,
                section,
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating section:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}