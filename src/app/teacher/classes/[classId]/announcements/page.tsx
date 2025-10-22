// src/app/teacher/classes/[classId]/announcements/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    Bell,
    Calendar,
    User,
    Plus,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function AnnouncementsPage({ params }: Props) {
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
            announcements: {
                include: {
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
                    _count: {
                        select: {
                            views: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            section: {
                include: {
                    students: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    const totalStudents = classData.section.students.length;

    const getViewRate = (announcement: any) => {
        if (totalStudents === 0) return 0;
        return (announcement._count.views / totalStudents) * 100;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                        <p className="text-gray-600 mt-2">
                            {classData.subjectName} - Grade {classData.section.gradeLevel} - {classData.section.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {classData.announcements.length} announcements • {totalStudents} students
                        </p>
                    </div>
                    <Link
                        href={`/teacher/classes/${classId}/announcements/new`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Announcement
                    </Link>
                </div>
            </div>

            {/* Announcement Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{classData.announcements.length}</p>
                            <p className="text-sm text-gray-600">Total Announcements</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Eye className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {classData.announcements.reduce((acc, ann) => acc + ann._count.views, 0)}
                            </p>
                            <p className="text-sm text-gray-600">Total Views</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                            <p className="text-sm text-gray-600">Students</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {classData.announcements.map((announcement) => {
                    const viewRate = getViewRate(announcement);

                    return (
                        <div
                            key={announcement.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Bell className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {announcement.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <User className="w-4 h-4" />
                                            <span>
                                                By {announcement.teacher.user.firstName} {announcement.teacher.user.lastName}
                                            </span>
                                            <Calendar className="w-4 h-4 ml-2" />
                                            <span>{formatDate(announcement.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {announcement.content}
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>
                                            {announcement._count.views} views ({viewRate.toFixed(0)}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/teacher/classes/${classId}/announcements/${announcement.id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {classData.announcements.length === 0 && (
                    <div className="text-center py-12">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                        <p className="text-gray-600 mb-4">Create your first announcement to share updates with students</p>
                        <Link
                            href={`/teacher/classes/${classId}/announcements/new`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create First Announcement
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}