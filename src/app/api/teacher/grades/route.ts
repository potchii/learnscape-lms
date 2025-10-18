import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await requireSession("TEACHER");
        const { studentId, classId, score, emojiFeedback, assignmentName } = await request.json();

        const teacher = await prisma.teacher.findFirst({
            where: { userId: session.user.id }
        });

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        // Verify the teacher teaches this class
        const classItem = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: teacher.id
            }
        });

        if (!classItem) {
            return NextResponse.json({ error: "Class not found or access denied" }, { status: 403 });
        }

        // Create or update grade with emoji feedback
        const grade = await prisma.grade.create({
            data: {
                studentId,
                classId,
                teacherId: teacher.id,
                score: parseFloat(score),
                remarks: emojiFeedback, // Store emoji feedback in remarks field
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                class: {
                    select: {
                        subjectName: true,
                    },
                },
            },
        });

        return NextResponse.json({
            message: "Grade submitted successfully",
            grade
        });
    } catch (error: any) {
        console.error("Error submitting grade:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
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