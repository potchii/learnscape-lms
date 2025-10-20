"use client";

import { useState } from "react";
import { Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";

interface AssignmentWithDetails extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
    submissions: AssignmentSubmission[];
}

interface AssignmentListProps {
    upcomingAssignments: AssignmentWithDetails[];
    submittedAssignments: AssignmentWithDetails[];
    missedAssignments: AssignmentWithDetails[];
}

export function AssignmentList({
    upcomingAssignments,
    submittedAssignments,
    missedAssignments
}: AssignmentListProps) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'submitted' | 'missed'>('upcoming');

    const getAssignmentStatus = (assignment: AssignmentWithDetails) => {
        const submission = assignment.submissions[0];
        const now = new Date();

        if (!submission || submission.status === 'NOT_SUBMITTED') {
            return assignment.dueDate < now ? 'missed' : 'not_submitted';
        }
        return submission.status.toLowerCase();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-blue-100 text-blue-800';
            case 'graded': return 'bg-green-100 text-green-800';
            case 'late': return 'bg-orange-100 text-orange-800';
            case 'missed': return 'bg-red-100 text-red-800';
            case 'not_submitted': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'submitted': return 'Submitted';
            case 'graded': return 'Graded';
            case 'late': return 'Late';
            case 'missed': return 'Missed';
            case 'not_submitted': return 'To Do';
            default: return 'Unknown';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted': return '📤';
            case 'graded': return '✅';
            case 'late': return '⏰';
            case 'missed': return '❌';
            case 'not_submitted': return '📝';
            default: return '❓';
        }
    };

    const getDaysUntilDue = (dueDate: Date): string => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 0) return 'Past due';
        if (diffDays < 7) return `In ${diffDays} days`;
        return `In ${Math.ceil(diffDays / 7)} weeks`;
    };

    const canSubmit = (assignment: AssignmentWithDetails) => {
        const status = getAssignmentStatus(assignment);
        return status === 'not_submitted' && assignment.dueDate > new Date();
    };

    const tabs = [
        { key: 'upcoming' as const, name: 'To Do', count: upcomingAssignments.length, icon: '📝' },
        { key: 'submitted' as const, name: 'Submitted', count: submittedAssignments.length, icon: '✅' },
        { key: 'missed' as const, name: 'Missed', count: missedAssignments.length, icon: '❌' },
    ];

    const currentAssignments =
        activeTab === 'upcoming' ? upcomingAssignments :
            activeTab === 'submitted' ? submittedAssignments :
                missedAssignments;

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <span>{tab.icon}</span>
                                <span>{tab.name}</span>
                                {tab.count > 0 && (
                                    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${activeTab === tab.key ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Assignment List */}
            <div className="p-6">
                {currentAssignments.length > 0 ? (
                    <div className="space-y-4">
                        {currentAssignments.map((assignment) => {
                            const status = getAssignmentStatus(assignment);
                            const submission = assignment.submissions[0];

                            return (
                                <div
                                    key={assignment.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {assignment.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                                                    {getStatusIcon(status)} {getStatusText(status)}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mb-2 line-clamp-2">
                                                {assignment.description}
                                            </p>

                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="font-medium">{assignment.class.subjectName}</span>
                                                <span>•</span>
                                                <span>
                                                    {assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium">
                                                    Due: {assignment.dueDate.toLocaleDateString()}
                                                </span>
                                                <span>•</span>
                                                <span className="text-orange-600 font-medium">
                                                    {getDaysUntilDue(assignment.dueDate)}
                                                </span>
                                                {assignment.maxScore && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Max Score: {assignment.maxScore}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Submission Details */}
                                            {submission && (
                                                <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-blue-700">
                                                            Submitted: {submission.submittedAt?.toLocaleDateString()}
                                                        </span>
                                                        {submission.score && assignment.maxScore && (
                                                            <span className="font-semibold text-blue-800">
                                                                Score: {submission.score}/{assignment.maxScore}
                                                            </span>
                                                        )}
                                                        {submission.fileUrl && (
                                                            <a
                                                                href={submission.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                                                            >
                                                                View File
                                                            </a>
                                                        )}
                                                    </div>
                                                    {submission.feedback && (
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            <strong>Feedback:</strong> {submission.feedback}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-2 ml-4">
                                            <Link
                                                href={`/student/assignments/${assignment.id}`}
                                                className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors text-center"
                                            >
                                                View Details
                                            </Link>
                                            {canSubmit(assignment) && (
                                                <Link
                                                    href={`/student/assignments/${assignment.id}/submit`}
                                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors text-center"
                                                >
                                                    Submit Work
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            {activeTab === 'upcoming' && (
                                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )}
                            {activeTab === 'submitted' && (
                                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {activeTab === 'missed' && (
                                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {activeTab === 'upcoming' && 'No homework to do!'}
                            {activeTab === 'submitted' && 'No submitted homework'}
                            {activeTab === 'missed' && 'No missed homework'}
                        </h3>
                        <p className="text-gray-500">
                            {activeTab === 'upcoming' && 'You\'re all caught up with your homework!'}
                            {activeTab === 'submitted' && 'Homework you submit will appear here.'}
                            {activeTab === 'missed' && 'Great job keeping up with deadlines!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}