import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireSession("ADMIN");

        const student = await prisma.student.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        gender: true,
                        birthdate: true,
                        address: true,
                        phoneNumber: true,
                        createdAt: true,
                    },
                },
                parent: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                                phoneNumber: true,
                            },
                        },
                    },
                },
                section: {
                    select: {
                        id: true,
                        name: true,
                        gradeLevel: true,
                    },
                },
                attendance: {
                    include: {
                        class: {
                            select: {
                                subjectName: true,
                            },
                        },
                    },
                    orderBy: {
                        date: "desc",
                    },
                    take: 5,
                },
                grades: {
                    include: {
                        class: {
                            select: {
                                subjectName: true,
                            },
                        },
                    },
                    orderBy: {
                        gradedAt: "desc",
                    },
                    take: 5,
                },
            },
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        return NextResponse.json(student);
    } catch (error: any) {
        console.error("Error fetching student:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireSession("ADMIN");

        const {
            firstName,
            middleName,
            lastName,
            email,
            gender,
            birthdate,
            address,
            phoneNumber,
            sectionId,
            parentId,
        } = await request.json();

        // Get student first to find user ID
        const student = await prisma.student.findUnique({
            where: { id: params.id },
            include: { user: true },
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Update user
            await tx.user.update({
                where: { id: student.userId },
                data: {
                    firstName,
                    middleName,
                    lastName,
                    email,
                    gender,
                    birthdate: new Date(birthdate),
                    address,
                    phoneNumber,
                },
            });

            // Update student
            const updatedStudent = await tx.student.update({
                where: { id: params.id },
                data: {
                    sectionId,
                    parentId,
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            middleName: true,
                            lastName: true,
                            email: true,
                            gender: true,
                            birthdate: true,
                            address: true,
                            phoneNumber: true,
                        },
                    },
                    section: {
                        select: {
                            id: true,
                            name: true,
                            gradeLevel: true,
                        },
                    },
                    parent: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            });

            return updatedStudent;
        });

        return NextResponse.json({
            message: "Student updated successfully",
            student: result,
        });
    } catch (error: any) {
        console.error("Error updating student:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}