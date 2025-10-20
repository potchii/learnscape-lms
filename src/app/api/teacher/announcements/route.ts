import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        await requireSession(["TEACHER", "ADMIN"]);

        const { title, content, classId, teacherId } = await request.json();

        // Validate required fields
        if (!title?.trim() || !content?.trim() || !teacherId) {
            return NextResponse.json(
                { error: "Title, content, and teacher are required" },
                { status: 400 }
            );
        }

        // If classId is provided, verify the teacher teaches this class
        if (classId) {
            const classItem = await prisma.class.findFirst({
                where: {
                    id: classId,
                    teacherId: teacherId,
                },
            });

            if (!classItem) {
                return NextResponse.json(
                    { error: "Class not found or access denied" },
                    { status: 403 }
                );
            }
        }

        // Create the announcement
        const announcement = await prisma.announcement.create({
            data: {
                title: title.trim(),
                content: content.trim(),
                classId: classId || null, // null for school-wide announcements
                teacherId,
            },
            include: {
                class: classId ? {
                    include: {
                        section: true,
                    },
                } : false,
                teacher: {
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

        return NextResponse.json(
            {
                message: "Announcement created successfully",
                announcement: {
                    id: announcement.id,
                    title: announcement.title,
                    type: classId ? 'class' : 'school',
                    class: announcement.class ? {
                        subjectName: announcement.class.subjectName,
                        section: `Grade ${announcement.class.section.gradeLevel} ${announcement.class.section.name}`,
                    } : null,
                    teacher: `${announcement.teacher.user.firstName} ${announcement.teacher.user.lastName}`,
                },
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating announcement:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}