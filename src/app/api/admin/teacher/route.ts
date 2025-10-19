import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        await requireSession("ADMIN");

        console.log("Fetching teachers from database...");

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

        console.log(`Found ${teachers.length} teachers:`, teachers.map(t => ({
            id: t.id,
            name: `${t.user.firstName} ${t.user.lastName}`,
            employeeNumber: t.employeeNumber
        })));

        return NextResponse.json({
            success: true,
            teachers,
            count: teachers.length
        });
    } catch (error: any) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error"
            },
            { status: 500 }
        );
    }
}