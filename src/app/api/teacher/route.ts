import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        await requireSession("ADMIN");

        const teachers = await prisma.teacher.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                classes: {
                    select: {
                        id: true,
                        subjectName: true,
                        section: {
                            select: {
                                name: true,
                                gradeLevel: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                user: {
                    firstName: 'asc',
                },
            },
        });

        return NextResponse.json({ teachers });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}