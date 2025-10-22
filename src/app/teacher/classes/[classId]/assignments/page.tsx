// src/app/teacher/classes/[classId]/assignments/page.tsx
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
    Circle
} from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function AssignmentsPage({ params }: Props) {
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
                        select: {
                            id: true,
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
                    submissions: {
                        include: {
                            student: {
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
                },
                orderBy: [
                    {
                        dueDate: 'asc',
                    },
                    {
                        createdAt: 'desc',
                    },
                ],
            },
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    const totalStudents = classData.section.students.length;

    const getAssignmentStatus = (assignment: any) => {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);

        if (assignment.status === 'CLOSED') return 'closed';
        if (dueDate < now) return 'overdue';
        if (assignment.status === 'DRAFT') return 'draft';
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

    const getSubmissionRate = (assignment: any) => {
        if (totalStudents === 0) return 0;
        return (assignment._count.submissions / totalStudents) * 100;
    };

    const getGradedCount = (assignment: any) => {
        return assignment.submissions.filter((sub: any) => sub.score !== null).length;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                        <p className="text-gray-600 mt-2">
                            {classData.subjectName} - Grade {classData.section.gradeLevel} - {classData.section.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {classData.Assignment.length} assignments • {totalStudents} students
                        </p>
                    </div>
                    <Link
                        href={`/teacher/classes/${classId}/assignments/new`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Assignment
                    </Link>
                </div>
            </div>

            {/* Assignment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{classData.Assignment.length}</p>
                            <p className="text-sm text-gray-600">Total Assignments</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {classData.Assignment.filter(a => getAssignmentStatus(a) === 'closed').length}
                            </p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {classData.Assignment.filter(a => getAssignmentStatus(a) === 'active').length}
                            </p>
                            <p className="text-sm text-gray-600">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {classData.Assignment.filter(a => getAssignmentStatus(a) === 'overdue').length}
                            </p>
                            <p className="text-sm text-gray-600">Overdue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assignment
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
                            {classData.Assignment.map((assignment) => {
                                const status = getAssignmentStatus(assignment);
                                const submissionRate = getSubmissionRate(assignment);
                                const gradedCount = getGradedCount(assignment);

                                return (
                                    <tr key={assignment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {assignment.title}
                                                    </div>
                                                    {assignment.description && (
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {assignment.description}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {assignment.maxScore ? `Max score: ${assignment.maxScore}` : 'No max score'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(assignment.dueDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(assignment.dueDate).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {assignment._count.submissions} / {totalStudents}
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${submissionRate}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {submissionRate.toFixed(0)}% submitted • {gradedCount} graded
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
                                                    href={`/teacher/classes/${classId}/assignments/${assignment.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                >
                                                    <BarChart3 className="w-3 h-3" />
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/teacher/classes/${classId}/assignments/${assignment.id}/edit`}
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {classData.Assignment.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                        <p className="text-gray-600 mb-4">Create your first assignment to get started</p>
                        <Link
                            href={`/teacher/classes/${classId}/assignments/new`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create First Assignment
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex justify-center">
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 text-center">
                        Need to manage grades?{' '}
                        <Link
                            href={`/teacher/gradebook/${classId}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Go to Gradebook →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}