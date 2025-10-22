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
    PlusCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function ManageClassPage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId } = await params;

    // Only include relations that exist in your schema
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
            // Only include Assignment if it exists in your schema
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
            _count: {
                select: {
                    learningMaterials: true,
                    attendance: true,
                    Assignment: true,
                },
            },
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    // Fetch quizzes separately since the relation doesn't exist
    let quizzes: any[] = [];
    let quizzesCount = 0;

    try {
        const quizData = await prisma.quiz.findMany({
            where: {
                classId: classId,
            },
            include: {
                _count: {
                    select: {
                        attempts: true,
                    },
                },
            },
            orderBy: {
                dueDate: 'asc',
            },
        });
        quizzes = quizData;
        quizzesCount = quizData.length;
    } catch (error) {
        console.log('Quizzes not available yet');
    }

    // Fetch announcements separately
    let announcements: any[] = [];

    try {
        const announcementData = await prisma.announcement.findMany({
            where: {
                classId: classId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });
        announcements = announcementData;
    } catch (error) {
        console.log('Announcements not available yet');
    }

    // Combine assignments and quizzes into one array for upcoming tasks
    const upcomingTasks = [
        ...(classData.Assignment?.map((assignment: any) => ({
            id: assignment.id,
            title: assignment.title,
            dueDate: assignment.dueDate,
            type: 'assignment' as const,
            maxScore: assignment.maxScore,
            submissionCount: assignment._count?.submissions || 0,
            totalStudents: classData.section?.students?.length || 0,
            status: assignment.status,
        })) || []),
        ...quizzes.map((quiz: any) => ({
            id: quiz.id,
            title: quiz.title,
            dueDate: quiz.dueDate,
            type: 'quiz' as const,
            maxScore: quiz.maxScore,
            submissionCount: quiz._count?.attempts || 0,
            totalStudents: classData.section?.students?.length || 0,
            status: quiz.status,
        })),
    ]
        .filter(task => {
            const now = new Date();
            const dueDate = new Date(task.dueDate);

            // Include tasks that are due today or in the future
            return dueDate >= now;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3);

    const recentAnnouncements = announcements.slice(0, 3);
    const assignmentCount = classData.Assignment?.length || 0;
    const totalTasks = assignmentCount + quizzesCount;

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
                            {classData.section ? `Grade ${classData.section.gradeLevel} - ${classData.section.name}` : 'No section assigned'}
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

                {quizzesCount >= 0 && ( // Only show if quizzes table exists
                    <Link
                        href={`/teacher/classes/${classId}/quizzes/new`}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Create Quiz</h3>
                                <p className="text-sm text-gray-600 mt-1">Multiple choice assessment</p>
                            </div>
                            <PlusCircle className="w-5 h-5 text-gray-400 ml-auto" />
                        </div>
                    </Link>
                )}

                <Link
                    href={`/teacher/classes/${classId}/materials/new`}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Add Learning Material</h3>
                            <p className="text-sm text-gray-600 mt-1">Share resources with students</p>
                        </div>
                        <PlusCircle className="w-5 h-5 text-gray-400 ml-auto" />
                    </div>
                </Link>

                <Link
                    href={`/teacher/classes/${classId}/attendance`}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                            <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Take Attendance</h3>
                            <p className="text-sm text-gray-600 mt-1">Record student attendance</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href={`/teacher/classes/${classId}/students`}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                            <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Student Roster</h3>
                            <p className="text-sm text-gray-600 mt-1">View all students</p>
                        </div>
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
                            <p className="text-2xl font-bold text-gray-900">{classData.section?.students?.length || 0}</p>
                            <p className="text-sm text-gray-600">Students</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <FileText className="w-8 h-8 text-green-600 mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{assignmentCount}</p>
                            <p className="text-sm text-gray-600">Assignments</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{quizzesCount}</p>
                            <p className="text-sm text-gray-600">Quizzes</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{classData._count?.attendance || 0}</p>
                            <p className="text-sm text-gray-600">Attendance Records</p>
                        </div>
                    </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
                        <Link
                            href={`/teacher/classes/${classId}/tasks`}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            View All ({totalTasks})
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {upcomingTasks.map((task) => (
                            <div key={`${task.type}-${task.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {task.type === 'assignment' ? (
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    ) : (
                                        <BookOpen className="w-5 h-5 text-purple-600" />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">{task.title}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${task.type === 'assignment'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {task.type === 'assignment' ? 'Assignment' : 'Quiz'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {task.submissionCount} / {task.totalStudents}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {task.maxScore ? `${task.maxScore} pts` : 'No max score'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {upcomingTasks.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
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
                            View All ({announcements.length})
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentAnnouncements.map((announcement: any) => (
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
                        <Link
                            href={`/teacher/classes/${classId}/materials`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <BookOpen className="w-5 h-5 text-orange-600" />
                            <span className="font-medium text-gray-900">Learning Materials</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}