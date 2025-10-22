// src/app/teacher/classes/[classId]/tasks/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    FileText,
    Calendar,
    Users,
    Plus,
    Edit,
    BarChart3,
    Clock,
    CheckCircle2,
    Circle,
    BookOpen,
    Eye
} from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function TasksPage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId } = await params;

    // Fetch class basic info
    const classData = await prisma.class.findUnique({
        where: {
            id: classId,
            teacher: {
                userId: session.user.id,
            },
        },
        select: {
            id: true,
            subjectName: true,
            sectionId: true,
            schedule: true,
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    // Fetch section data separately
    let sectionData: any = null;
    let totalStudents = 0;

    try {
        sectionData = await prisma.section.findUnique({
            where: {
                id: classData.sectionId,
            },
            include: {
                students: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        totalStudents = sectionData?.students?.length || 0;
    } catch (error) {
        console.log('Section data not available');
    }

    // Fetch assignments separately
    let assignments: any[] = [];

    try {
        assignments = await prisma.assignment.findMany({
            where: {
                classId: classId,
            },
            include: {
                _count: {
                    select: {
                        submissions: true,
                    },
                },
                submissions: {
                    select: {
                        id: true,
                        score: true,
                    },
                },
            },
            orderBy: {
                dueDate: 'asc',
            },
        });
    } catch (error) {
        console.log('Assignments not available');
    }

    // Fetch quizzes separately
    let quizzes: any[] = [];

    try {
        quizzes = await prisma.quiz.findMany({
            where: {
                classId: classId,
            },
            include: {
                _count: {
                    select: {
                        attempts: true,
                    },
                },
                attempts: {
                    select: {
                        id: true,
                        score: true,
                    },
                },
            },
            orderBy: {
                dueDate: 'asc',
            },
        });
    } catch (error) {
        console.log('Quizzes not available');
    }

    // Combine assignments and quizzes into one array
    const allTasks = [
        ...assignments.map((assignment: any) => ({
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
            type: 'assignment' as const,
            maxScore: assignment.maxScore,
            status: assignment.status,
            submissionCount: assignment._count?.submissions || 0,
            gradedCount: assignment.submissions?.filter((sub: any) => sub.score !== null).length || 0,
            createdAt: assignment.createdAt,
        })),
        ...quizzes.map((quiz: any) => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            dueDate: quiz.dueDate,
            type: 'quiz' as const,
            maxScore: quiz.maxScore,
            status: quiz.status,
            submissionCount: quiz._count?.attempts || 0,
            gradedCount: quiz.attempts?.filter((attempt: any) => attempt.score !== null).length || 0,
            createdAt: quiz.createdAt,
        })),
    ].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const getTaskStatus = (task: any) => {
        const now = new Date();
        const dueDate = new Date(task.dueDate);

        if (task.status === 'CLOSED') return 'closed';
        if (dueDate < now) return 'overdue';
        if (task.status === 'DRAFT') return 'draft';
        return 'active';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'closed':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'overdue':
                return <Clock className="w-4 h-4 text-red-600" />;
            case 'draft':
                return <Circle className="w-4 h-4 text-gray-400" />;
            default:
                return <Clock className="w-4 h-4 text-blue-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'closed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'draft':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getTypeColor = (type: string) => {
        return type === 'assignment'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800';
    };

    const getTypeIcon = (type: string) => {
        return type === 'assignment'
            ? <FileText className="w-4 h-4" />
            : <BookOpen className="w-4 h-4" />;
    };

    const getSubmissionRate = (task: any) => {
        if (totalStudents === 0) return 0;
        return (task.submissionCount / totalStudents) * 100;
    };

    // Statistics
    const totalTasks = allTasks.length;
    const assignmentsCount = assignments.length;
    const quizzesCount = quizzes.length;
    const activeTasks = allTasks.filter(task => getTaskStatus(task) === 'active').length;
    const overdueTasks = allTasks.filter(task => getTaskStatus(task) === 'overdue').length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
                        <p className="text-gray-600 mt-2">
                            {classData.subjectName}
                            {sectionData && ` - Grade ${sectionData.gradeLevel} - ${sectionData.name}`}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {totalTasks} tasks • {assignmentsCount} assignments • {quizzesCount} quizzes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/teacher/classes/${classId}/assignments/new`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Assignment
                        </Link>
                        <Link
                            href={`/teacher/classes/${classId}/quizzes/new`}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Quiz
                        </Link>
                    </div>
                </div>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                            <p className="text-sm text-gray-600">Total Tasks</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{assignmentsCount}</p>
                            <p className="text-sm text-gray-600">Assignments</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{quizzesCount}</p>
                            <p className="text-sm text-gray-600">Quizzes</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
                            <p className="text-sm text-gray-600">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Clock className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
                            <p className="text-sm text-gray-600">Overdue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Task
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submissions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allTasks.map((task) => {
                                const status = getTaskStatus(task);
                                const submissionRate = getSubmissionRate(task);

                                return (
                                    <tr key={`${task.type}-${task.id}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getTypeIcon(task.type)}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                        {task.title}
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(task.type)}`}>
                                                            {task.type === 'assignment' ? 'Assignment' : 'Quiz'}
                                                        </span>
                                                    </div>
                                                    {task.description && (
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {task.description}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Created: {new Date(task.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(task.dueDate).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {task.submissionCount} / {totalStudents}
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="h-2 rounded-full"
                                                    style={{
                                                        width: `${submissionRate}%`,
                                                        backgroundColor: task.type === 'assignment' ? '#2563eb' : '#7c3aed'
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {submissionRate.toFixed(0)}% submitted • {task.gradedCount} graded
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                                {getStatusIcon(status)}
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={
                                                        task.type === 'assignment'
                                                            ? `/teacher/classes/${classId}/assignments/${task.id}`
                                                            : `/teacher/classes/${classId}/quizzes/${task.id}/results`
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    View
                                                </Link>
                                                <Link
                                                    href={
                                                        task.type === 'assignment'
                                                            ? `/teacher/gradebook/${classId}/manage`
                                                            : `/teacher/classes/${classId}/quizzes/${task.id}/results`
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                                >
                                                    <BarChart3 className="w-3 h-3" />
                                                    {task.type === 'assignment' ? 'Grade' : 'Results'}
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {allTasks.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                        <p className="text-gray-600 mb-4">Create your first assignment or quiz to get started</p>
                        <div className="flex gap-3 justify-center">
                            <Link
                                href={`/teacher/classes/${classId}/assignments/new`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Assignment
                            </Link>
                            <Link
                                href={`/teacher/classes/${classId}/quizzes/new`}
                                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Quiz
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment Resources</h3>
                    <div className="space-y-2">
                        <Link
                            href={`/teacher/classes/${classId}/assignments`}
                            className="block text-blue-600 hover:text-blue-700 text-sm"
                        >
                            View All Assignments →
                        </Link>
                        <Link
                            href={`/teacher/gradebook/${classId}`}
                            className="block text-blue-600 hover:text-blue-700 text-sm"
                        >
                            Gradebook →
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz Resources</h3>
                    <div className="space-y-2">
                        <Link
                            href={`/teacher/classes/${classId}/quizzes`}
                            className="block text-purple-600 hover:text-purple-700 text-sm"
                        >
                            View All Quizzes →
                        </Link>
                        <Link
                            href={`/teacher/classes/${classId}/quizzes/new`}
                            className="block text-purple-600 hover:text-purple-700 text-sm"
                        >
                            Create New Quiz →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}