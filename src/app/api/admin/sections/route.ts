import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

// GET - Fetch all sections
export async function GET() {
    try {
        await requireSession("ADMIN");

        const sections = await prisma.section.findMany({
            orderBy: [
                { gradeLevel: 'asc' },
                { name: 'asc' },
            ],
        });

        return NextResponse.json({ sections });
    } catch (error) {
        console.error("Error fetching sections:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new section
export async function POST(req: Request) {
    try {
        await requireSession("ADMIN");

        const { gradeLevel, name } = await req.json();

        // Validate required fields
        if (!gradeLevel || !name?.trim()) {
            return NextResponse.json(
                { error: "Grade level and section name are required" },
                { status: 400 }
            );
        }

        // Validate grade level
        const grade = parseInt(gradeLevel);
        if (grade < 1 || grade > 12) {
            return NextResponse.json(
                { error: "Grade level must be between 1 and 12" },
                { status: 400 }
            );
        }

        // Check if section already exists for this grade
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
                section
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