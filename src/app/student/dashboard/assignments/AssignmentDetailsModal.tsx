"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
    submissions: Array<{
        id: string;
        status: string;
        submittedAt: Date | null;
        score: number | null;
        feedback: string | null;
        fileUrl: string | null;
    }>;
}

interface AssignmentDetailsModalProps {
    assignment: Assignment;
}

export function AssignmentDetailsModal({ assignment }: AssignmentDetailsModalProps) {
    const submission = assignment.submissions[0];
    const isPastDue = new Date() > assignment.dueDate;

    const getStatusColor = (status: string) => {
        if (!submission || submission.status === 'NOT_SUBMITTED') {
            return isPastDue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
        }

        if (submission.status === 'SUBMITTED') return 'bg-blue-100 text-blue-800';
        if (submission.status === 'LATE') return 'bg-orange-100 text-orange-800';
        if (submission.status === 'GRADED') return 'bg-green-100 text-green-800';

        return 'bg-gray-100 text-gray-800';
    };

    const getStatusText = () => {
        if (!submission || submission.status === 'NOT_SUBMITTED') {
            return isPastDue ? 'Missed' : 'Not Submitted';
        }

        return submission.status.charAt(0) + submission.status.slice(1).toLowerCase();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeRemaining = () => {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const diff = dueDate.getTime() - now.getTime();

        if (diff <= 0) {
            return 'Due date has passed';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''} remaining`;
        } else {
            return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-sm">
                    Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{assignment.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Assignment Header */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold text-gray-700">Subject:</span>
                                <p className="text-gray-600">{assignment.class.subjectName}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Teacher:</span>
                                <p className="text-gray-600">
                                    {assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Due Date:</span>
                                <p className="text-gray-600">{formatDate(assignment.dueDate)}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Status:</span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission?.status || 'NOT_SUBMITTED')}`}>
                                    {getStatusText()}
                                </span>
                            </div>
                            {assignment.maxScore && (
                                <div>
                                    <span className="font-semibold text-gray-700">Maximum Score:</span>
                                    <p className="text-gray-600">{assignment.maxScore} points</p>
                                </div>
                            )}
                            {!isPastDue && (
                                <div>
                                    <span className="font-semibold text-gray-700">Time Remaining:</span>
                                    <p className="text-gray-600">{getTimeRemaining()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assignment Description */}
                    {assignment.description && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {assignment.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submission Details */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Your Submission</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            {submission ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">Submission Status:</span>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                                            {getStatusText()}
                                        </span>
                                    </div>

                                    {submission.submittedAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-700">Submitted At:</span>
                                            <span className="text-gray-600">
                                                {formatDate(submission.submittedAt)}
                                            </span>
                                        </div>
                                    )}

                                    {submission.fileUrl && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-700">Submitted File:</span>
                                            <a
                                                href={submission.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                                            >
                                                View Submitted File
                                            </a>
                                        </div>
                                    )}

                                    {submission.score !== null && assignment.maxScore && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-700">Score:</span>
                                            <span className="text-gray-600 font-semibold">
                                                {submission.score}/{assignment.maxScore}
                                            </span>
                                        </div>
                                    )}

                                    {submission.feedback && (
                                        <div>
                                            <span className="font-medium text-gray-700 block mb-2">Teacher Feedback:</span>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {submission.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="text-gray-400 mb-2">
                                        <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">No submission yet</p>
                                    {!isPastDue && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            Remember to submit before the due date!
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Important Notes
                        </h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                            <li>• Make sure your submission meets all requirements</li>
                            <li>• Only one file can be submitted per assignment</li>
                            <li>• File size limit: 10MB</li>
                            <li>• Supported formats: PDF, Word, Images, Text, ZIP</li>
                            {!isPastDue && (
                                <li>• You can resubmit until the due date</li>
                            )}
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}