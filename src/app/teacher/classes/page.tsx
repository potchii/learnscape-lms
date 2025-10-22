// src/app/teacher/classes/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function TeacherClassesPage() {
    const session = await requireSession(["TEACHER"]);

    const teacher = await prisma.teacher.findFirst({
        where: { userId: session.user.id },
        include: {
            classes: {
                include: {
                    section: {
                        select: {
                            name: true,
                            gradeLevel: true,
                            students: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                    Assignment: {
                        select: {
                            id: true,
                        },
                    },
                    announcements: {
                        select: {
                            id: true,
                        },
                    },
                    learningMaterials: {
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
        return <div>Teacher not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
                <p className="text-gray-600 mt-2">Manage your classes and teaching materials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacher.classes.map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {classItem.subjectName}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Grade {classItem.section.gradeLevel} - {classItem.section.name}
                                </p>
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {classItem.section.students.length} students
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Assignments:</span>
                                <span className="font-medium">{classItem.Assignment.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Announcements:</span>
                                <span className="font-medium">{classItem.announcements.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Materials:</span>
                                <span className="font-medium">{classItem.learningMaterials.length}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Link
                                href={`/teacher/classes/${classItem.id}`}
                                className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Manage Class
                            </Link>
                            <Link
                                href={`/teacher/classes/${classItem.id}/grades`}
                                className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                View Grades
                            </Link>
                        </div>

                        {classItem.schedule && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Schedule: {classItem.schedule}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {teacher.classes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes assigned</h3>
                    <p className="text-gray-500">You haven't been assigned to any classes yet.</p>
                </div>
            )}
        </div>
    );
}