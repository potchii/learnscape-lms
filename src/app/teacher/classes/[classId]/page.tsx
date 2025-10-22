// src/app/teacher/classes/[classId]/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    BookOpen,
    Users,
    Calendar,
    BarChart3,
    Bell,
    FileText,
    PlusCircle
} from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function ManageClassPage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId } = await params;

    const classData = await prisma.class.findUnique({
        where: {
            id: classId,
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
                        },
                    },
                },
            },
            Assignment: {
                include: {
                    _count: {
                        select: {
                            submissions: true,
                        },
                    },
                },
                orderBy: {
                    dueDate: 'asc',
                },
            },
            announcements: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 5,
            },
            _count: {
                select: {
                    learningMaterials: true,
                    attendance: true,
                },
            },
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    const upcomingAssignments = classData.Assignment.filter(
        assignment => new Date(assignment.dueDate) > new Date()
    ).slice(0, 3);

    const recentAnnouncements = classData.announcements.slice(0, 3);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {classData.subjectName}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Grade {classData.section.gradeLevel} - {classData.section.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {classData.schedule || 'Schedule not set'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/teacher/gradebook/${classId}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
                            View Gradebook
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link
                    href={`/teacher/classes/${classId}/announcements/new`}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <Bell className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Create Announcement</h3>
                            <p className="text-sm text-gray-600 mt-1">Share updates with students</p>
                        </div>
                        <PlusCircle className="w-5 h-5 text-gray-400 ml-auto" />
                    </div>
                </Link>

                <Link
                    href={`/teacher/classes/${classId}/assignments/new`}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Create Assignment</h3>
                            <p className="text-sm text-gray-600 mt-1">Add new coursework</p>
                        </div>
                        <PlusCircle className="w-5 h-5 text-gray-400 ml-auto" />
                    </div>
                </Link>

                <Link
                    href={`/teacher/classes/${classId}/materials/new`}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Learning Materials</h3>
                            <p className="text-sm text-gray-600 mt-1">Share resources</p>
                        </div>
                        <PlusCircle className="w-5 h-5 text-gray-400 ml-auto" />
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Class Overview */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Users className="w-8 h-8 text-blue-600 mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{classData.section.students.length}</p>
                            <p className="text-sm text-gray-600">Students</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <FileText className="w-8 h-8 text-green-600 mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{classData.Assignment.length}</p>
                            <p className="text-sm text-gray-600">Assignments</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{classData._count.learningMaterials}</p>
                            <p className="text-sm text-gray-600">Materials</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{classData._count.attendance}</p>
                            <p className="text-sm text-gray-600">Attendance Records</p>
                        </div>
                    </div>
                </div>

                {/* Upcoming Assignments */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h2>
                        <Link
                            href={`/teacher/classes/${classId}/assignments`}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {upcomingAssignments.map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{assignment.title}</p>
                                    <p className="text-sm text-gray-600">
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {assignment._count.submissions} submissions
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Max: {assignment.maxScore || 'N/A'} pts
                                    </p>
                                </div>
                            </div>
                        ))}
                        {upcomingAssignments.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No upcoming assignments</p>
                        )}
                    </div>
                </div>

                {/* Recent Announcements */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
                        <Link
                            href={`/teacher/classes/${classId}/announcements`}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentAnnouncements.map((announcement) => (
                            <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900">{announcement.title}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {announcement.content}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {recentAnnouncements.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No recent announcements</p>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
                    <div className="space-y-3">
                        <Link
                            href={`/teacher/gradebook/${classId}/manage`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Manage Grades</span>
                        </Link>
                        <Link
                            href={`/teacher/classes/${classId}/attendance`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Calendar className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">Take Attendance</span>
                        </Link>
                        <Link
                            href={`/teacher/classes/${classId}/students`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Users className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-900">Student Roster</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}