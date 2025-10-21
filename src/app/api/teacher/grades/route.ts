import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const session = await requireSession(["TEACHER"]);

    try {
        const { studentId, classId, score, remarks, assignmentId } = await request.json();

        // Validate the teacher has access to this class
        const teacher = await prisma.teacher.findFirst({
            where: {
                userId: session.user.id,
                classes: {
                    some: {
                        id: classId,
                    },
                },
            },
        });

        if (!teacher) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Create the grade with assignment link
        const grade = await prisma.grade.create({
            data: {
                studentId,
                classId,
                teacherId: teacher.id,
                assignmentId: assignmentId || null, // Allow null for general grades
                score,
                remarks,
            },
            include: {
                assignment: {
                    select: {
                        title: true,
                        maxScore: true,
                    },
                },
            },
        });

        return NextResponse.json({ grade });
    } catch (error) {
        console.error("Error creating grade:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await requireSession("TEACHER");
        const { searchParams } = new URL(request.url);
        const classId = searchParams.get('classId');

        const teacher = await prisma.teacher.findFirst({
            where: { userId: session.user.id }
        });

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        // Get classes for the teacher
        const classes = await prisma.class.findMany({
            where: {
                teacherId: teacher.id,
            },
            include: {
                section: {
                    include: {
                        students: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                                grades: {
                                    where: {
                                        classId: classId || undefined,
                                    },
                                    orderBy: {
                                        gradedAt: 'desc',
                                    },
                                    take: 5, // Get recent 5 grades per student
                                },
                            },
                            orderBy: {
                                user: {
                                    firstName: 'asc',
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ classes });
    } catch (error: any) {
        console.error("Error fetching grades:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}