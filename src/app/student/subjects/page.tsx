// src/app/student/subjects/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function StudentSubjectsPage() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: {
                include: {
                    classes: {
                        include: {
                            teacher: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                            _count: {
                                select: {
                                    Assignment: {
                                        where: {
                                            status: "PUBLISHED",
                                        },
                                    },
                                    learningMaterials: true,
                                    announcements: true,
                                },
                            },
                        },
                        orderBy: {
                            subjectName: 'asc',
                        },
                    },
                },
            },
        },
    });

    if (!student) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Student Record Not Found</h2>
                    <p className="text-red-600">We couldn't find your student information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
                <p className="text-gray-600 mt-2">
                    Access all your course materials, assignments, and grades
                </p>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {student.section.classes.map((classItem) => (
                    <Link
                        key={classItem.id}
                        href={`/student/subjects/${classItem.id}`}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`h-14 w-14 rounded-lg flex items-center justify-center text-white ${getColorClasses(getClassColor(classItem.subjectName))}`}>
                                <span className="text-lg font-semibold">
                                    {classItem.subjectName.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {classItem._count.Assignment} assignments
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 text-xl mb-2 group-hover:text-blue-600 transition-colors">
                            {classItem.subjectName}
                        </h3>

                        <p className="text-gray-600 mb-4">
                            {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-blue-50 text-blue-700 py-2 rounded">
                                <div className="font-semibold">{classItem._count.announcements}</div>
                                <div>Announcements</div>
                            </div>
                            <div className="bg-green-50 text-green-700 py-2 rounded">
                                <div className="font-semibold">{classItem._count.learningMaterials}</div>
                                <div>Materials</div>
                            </div>
                            <div className="bg-purple-50 text-purple-700 py-2 rounded">
                                <div className="font-semibold">{classItem._count.Assignment}</div>
                                <div>Assignments</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                                View subject details →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {student.section.classes.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 0v8" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects enrolled</h3>
                    <p className="text-gray-500">You are not currently enrolled in any subjects.</p>
                </div>
            )}
        </div>
    );
}

// Reuse helper functions
function getClassColor(subjectName: string): string {
    const colorMap: { [key: string]: string } = {
        mathematics: 'blue',
        math: 'blue',
        science: 'green',
        english: 'purple',
        reading: 'purple',
        writing: 'purple',
        history: 'orange',
        social: 'orange',
        geography: 'red',
        art: 'pink',
        music: 'indigo',
        'physical education': 'teal',
        pe: 'teal',
        sports: 'teal',
    };
    const normalizedName = subjectName.toLowerCase();
    return colorMap[normalizedName] || 'gray';
}

function getColorClasses(color: string): string {
    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        pink: 'bg-pink-500',
        indigo: 'bg-indigo-500',
        teal: 'bg-teal-500',
        gray: 'bg-gray-500',
    };
    return colorClasses[color] || 'bg-gray-500';
}