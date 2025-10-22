// src/app/teacher/gradebook/[classId]/manage/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import ManageGrades from '@/components/teacher/gradebook/ManageGrades';

interface Props {
    params: Promise<{ // Add Promise wrapper
        classId: string;
    }>;
}

export default async function ManageGradesPage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId } = await params; // Await the params

    const classData = await prisma.class.findUnique({
        where: {
            id: classId, // Use the awaited classId
            teacher: {
                userId: session.user.id,
            },
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
                                    classId: classId, // Use the awaited classId
                                },
                                include: {
                                    assignment: {
                                        select: {
                                            id: true,
                                            title: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            user: {
                                lastName: 'asc',
                            },
                        },
                    },
                },
            },
            Assignment: {
                orderBy: {
                    dueDate: 'asc',
                },
            },
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Grades - {classData.subjectName}
                </h1>
                <p className="text-gray-600 mt-2">
                    Grade {classData.section.gradeLevel} - {classData.section.name}
                </p>
            </div>

            <ManageGrades
                classId={classId} // Use the awaited classId
                students={classData.section.students}
                assignments={classData.Assignment}
            />
        </div>
    );
}