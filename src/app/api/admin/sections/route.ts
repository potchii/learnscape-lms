import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

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