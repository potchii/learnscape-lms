// src/app/teacher/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function TeacherHomePage() {
    const session = await requireSession(["TEACHER"]);

    // Get teacher with classes and basic stats
    const teacher = await prisma.teacher.findFirst({
        where: { userId: session.user.id },
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
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 5,
                    },
                    // Remove the incorrect _count and calculate manually
                },
            },
        },
    });

    if (!teacher) {
        return <div>Teacher not found</div>;
    }

    // Calculate stats manually since _count had incorrect fields
    const totalStudents = teacher.classes.reduce((sum, cls) => sum + cls.section.students.length, 0);
    const totalAssignments = teacher.classes.reduce((sum, cls) => sum + cls.Assignment.length, 0);
    const totalAnnouncements = teacher.classes.reduce((sum, cls) => sum + cls.announcements.length, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {teacher.user.firstName}!
                </h1>
                <p className="text-gray-600 mt-2">Here's an overview of your classes and activities</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-blue-600">{teacher.classes.length}</div>
                    <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-purple-600">{totalAssignments}</div>
                    <div className="text-sm text-gray-600">Total Assignments</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-orange-600">{totalAnnouncements}</div>
                    <div className="text-sm text-gray-600">Recent Announcements</div>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
                    <Link
                        href="/teacher/classes"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View all classes →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teacher.classes.map((classItem) => (
                        <Link
                            key={classItem.id}
                            href={`/teacher/classes/${classItem.id}`}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
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

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Assignments:</span>
                                    <span className="font-medium">{classItem.Assignment.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Announcements:</span>
                                    <span className="font-medium">{classItem.announcements.length}</span>
                                </div>
                            </div>

                            {classItem.schedule && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">Schedule: {classItem.schedule}</p>
                                </div>
                            )}
                        </Link>
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

            {/* Recent Announcements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
                </div>
                <div className="p-6">
                    {teacher.classes.some(cls => cls.announcements.length > 0) ? (
                        <div className="space-y-4">
                            {teacher.classes.map((classItem) =>
                                classItem.announcements.map((announcement) => (
                                    <div key={announcement.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{announcement.content}</p>
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                <span>{classItem.subjectName}</span>
                                                <span>•</span>
                                                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No recent announcements</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}