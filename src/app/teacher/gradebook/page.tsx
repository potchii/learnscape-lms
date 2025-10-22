// src/app/teacher/gradebook/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';

export default async function GradebookPage() {
    const session = await requireSession(["TEACHER"]);

    const teacher = await prisma.teacher.findUnique({
        where: {
            userId: session.user.id,
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            classes: {
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
                                },
                            },
                        },
                    },
                    Assignment: { // Fixed: Capital A
                        select: {
                            id: true,
                        },
                    },
                },
                orderBy: {
                    subjectName: 'asc',
                },
            },
        },
    });

    if (!teacher) {
        return <div>Teacher profile not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gradebook</h1>
                <p className="text-gray-600 mt-2">
                    Manage grades for your classes and subjects.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacher.classes.map((classItem: any) => (
                    <div
                        key={classItem.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {classItem.subjectName}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Grade {classItem.section.gradeLevel} - {classItem.section.name}
                        </p>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Students: {classItem.section.students.length}</p>
                            <p>Assignments: {classItem.Assignment.length}</p> {/* Fixed: Capital A */}
                            <p>Schedule: {classItem.schedule || 'Not set'}</p>
                        </div>

                        <div className="mt-6 space-y-2">
                            <Link
                                href={`/teacher/gradebook/${classItem.id}`}
                                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                View Gradebook
                            </Link>
                            <Link
                                href={`/teacher/gradebook/${classItem.id}/manage`}
                                className="block w-full border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Manage Grades
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {teacher.classes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        You are not assigned to any classes yet.
                    </p>
                </div>
            )}
        </div>
    );
}