// src/app/teacher/gradebook/[classId]/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import GradebookTable from '@/components/teacher/gradebook/GradeBookTable';

interface Props {
    params: Promise<{ // Add Promise wrapper
        classId: string;
    }>;
}

export default async function ClassGradebookPage({ params }: Props) {
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
                                            maxScore: true,
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
                include: {
                    submissions: {
                        select: {
                            id: true,
                        },
                    },
                },
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
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {classData.subjectName} Gradebook
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Grade {classData.section.gradeLevel} - {classData.section.name}
                        </p>
                    </div>
                    <Link
                        href={`/teacher/gradebook/${classId}/manage`} // Use the awaited classId
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Manage Grades
                    </Link>
                </div>
            </div>

            <GradebookTable
                students={classData.section.students}
                assignments={classData.Assignment}
                classId={classId} // Use the awaited classId
            />
        </div>
    );
}