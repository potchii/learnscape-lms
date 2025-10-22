// src/app/teacher/classes/[classId]/assignments/[assignmentId]/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    FileText,
    Calendar,
    Users,
    ArrowLeft,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
        assignmentId: string;
    }>;
}

export default async function AssignmentDetailPage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId, assignmentId } = await params;

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId,
            classId: classId,
            class: {
                teacher: {
                    userId: session.user.id,
                },
            },
        },
        include: {
            class: {
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
                orderBy: {
                    submittedAt: 'desc',
                },
            },
            _count: {
                select: {
                    submissions: true,
                },
            },
        },
    });

    if (!assignment) {
        return <div>Assignment not found or you don't have access to it.</div>;
    }

    const totalStudents = assignment.class.section.students.length;
    const submissionRate = (assignment._count.submissions / totalStudents) * 100;
    const gradedCount = assignment.submissions.filter(sub => sub.score !== null).length;
    const lateSubmissions = assignment.submissions.filter(sub =>
        sub.status === 'LATE'
    ).length;

    const getAssignmentStatus = () => {
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
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'overdue':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'draft':
                return <Clock className="w-5 h-5 text-gray-400" />;
            default:
                return <Clock className="w-5 h-5 text-blue-600" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href={`/teacher/classes/${classId}/assignments`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Assignments
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
                        <p className="text-gray-600 mt-2">
                            {assignment.class.subjectName} - Grade {assignment.class.section.gradeLevel}
                        </p>
                        {assignment.description && (
                            <p className="text-gray-700 mt-3 max-w-2xl">
                                {assignment.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/teacher/gradebook/${classId}/manage`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Grade Submissions
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Assignment Details */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Due Date</label>
                                <p className="text-gray-900 flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                                    {new Date(assignment.dueDate).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Max Score</label>
                                <p className="text-gray-900 mt-1">
                                    {assignment.maxScore ? `${assignment.maxScore} points` : 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatusIcon(getAssignmentStatus())}
                                    <span className="text-gray-900 capitalize">{getAssignmentStatus()}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Created</label>
                                <p className="text-gray-900 mt-1">
                                    {new Date(assignment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submissions */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Submissions</h2>
                        <div className="space-y-4">
                            {assignment.submissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {submission.student.user.firstName} {submission.student.user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Submitted: {submission.submittedAt ?
                                                    new Date(submission.submittedAt).toLocaleDateString() : 'Not submitted'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${submission.status === 'LATE'
                                                ? 'bg-red-100 text-red-800'
                                                : submission.status === 'SUBMITTED'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {submission.status.replace('_', ' ')}
                                        </span>
                                        {submission.score !== null && (
                                            <span className="text-sm font-medium text-gray-900">
                                                {submission.score}
                                                {assignment.maxScore && ` / ${assignment.maxScore}`}
                                            </span>
                                        )}
                                        {submission.fileUrl && (
                                            <a
                                                href={submission.fileUrl}
                                                download
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {assignment.submissions.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No submissions yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Statistics */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Submission Rate</span>
                                    <span className="font-medium">{submissionRate.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${submissionRate}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {assignment._count.submissions} of {totalStudents} students
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
                                    <p className="text-xs text-green-600">Graded</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <p className="text-2xl font-bold text-red-600">{lateSubmissions}</p>
                                    <p className="text-xs text-red-600">Late</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href={`/teacher/gradebook/${classId}/manage`}
                                className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors block"
                            >
                                Grade All Submissions
                            </Link>
                            <Link
                                href={`/teacher/classes/${classId}/assignments/${assignmentId}/edit`}
                                className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors block"
                            >
                                Edit Assignment
                            </Link>
                            <button className="w-full text-left px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors">
                                Close Assignment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}