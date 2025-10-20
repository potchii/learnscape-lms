"use client";

import { useState } from "react";
import { Student, Assignment, AssignmentSubmission } from "@prisma/client";

interface StudentWithUser extends Student {
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}

interface AssignmentWithDetails extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        section: {
            gradeLevel: number;
            name: string;
        };
    };
    submissions: (AssignmentSubmission & {
        student: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    })[];
}

interface ParentAssignmentsViewProps {
    students: StudentWithUser[];
    assignments: AssignmentWithDetails[];
}

export function ParentAssignmentsView({ students, assignments }: ParentAssignmentsViewProps) {
    const [selectedStudent, setSelectedStudent] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [timeFilter, setTimeFilter] = useState<string>("all");

    const now = new Date();

    // Filter assignments based on selections
    const filteredAssignments = assignments.filter(assignment => {
        // Filter by student
        if (selectedStudent !== "all") {
            const hasStudentSubmission = assignment.submissions.some(
                sub => sub.studentId === selectedStudent
            );
            if (!hasStudentSubmission) return false;
        }

        // Filter by time
        if (timeFilter === "upcoming" && assignment.dueDate <= now) return false;
        if (timeFilter === "past" && assignment.dueDate > now) return false;

        return true;
    });

    const getSubmissionStatus = (assignment: AssignmentWithDetails, studentId: string) => {
        const submission = assignment.submissions.find(sub => sub.studentId === studentId);

        if (!submission || submission.status === 'NOT_SUBMITTED') {
            return assignment.dueDate < now ? 'missed' : 'not_submitted';
        }

        return submission.status.toLowerCase();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'graded':
                return 'bg-green-100 text-green-800';
            case 'late':
                return 'bg-orange-100 text-orange-800';
            case 'missed':
                return 'bg-red-100 text-red-800';
            case 'not_submitted':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'submitted':
                return 'Submitted';
            case 'graded':
                return 'Graded';
            case 'late':
                return 'Submitted Late';
            case 'missed':
                return 'Missed';
            case 'not_submitted':
                return 'Not Submitted';
            default:
                return 'Unknown';
        }
    };

    const getStudentSubmission = (assignment: AssignmentWithDetails, studentId: string) => {
        return assignment.submissions.find(sub => sub.studentId === studentId);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Group assignments by student for the summary view
    const studentAssignmentsSummary = students.map(student => {
        const studentAssignments = assignments.filter(assignment =>
            assignment.submissions.some(sub => sub.studentId === student.id)
        );

        const stats = {
            total: studentAssignments.length,
            submitted: studentAssignments.filter(assignment => {
                const submission = assignment.submissions.find(sub => sub.studentId === student.id);
                return submission && submission.status !== 'NOT_SUBMITTED';
            }).length,
            graded: studentAssignments.filter(assignment => {
                const submission = assignment.submissions.find(sub => sub.studentId === student.id);
                return submission && submission.status === 'GRADED';
            }).length,
            missed: studentAssignments.filter(assignment => {
                const submission = assignment.submissions.find(sub => sub.studentId === student.id);
                return (!submission || submission.status === 'NOT_SUBMITTED') && assignment.dueDate < now;
            }).length,
        };

        return {
            student,
            stats,
            submissionRate: stats.total > 0 ? (stats.submitted / stats.total) * 100 : 0,
        };
    });

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {studentAssignmentsSummary.map(({ student, stats, submissionRate }) => (
                    <div key={student.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {student.user.firstName} {student.user.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Grade {student.section.gradeLevel}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    {submissionRate.toFixed(0)}%
                                </div>
                                <div className="text-xs text-gray-500">Submission Rate</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-2 bg-green-50 rounded">
                                <div className="font-semibold text-green-700">{stats.submitted}</div>
                                <div className="text-green-600">Submitted</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                                <div className="font-semibold text-purple-700">{stats.graded}</div>
                                <div className="text-purple-600">Graded</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="font-semibold text-blue-700">{stats.total}</div>
                                <div className="text-blue-600">Total</div>
                            </div>
                            <div className="text-center p-2 bg-red-50 rounded">
                                <div className="font-semibold text-red-700">{stats.missed}</div>
                                <div className="text-red-600">Missed</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Student Filter */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Student
                        </label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="all">All Students</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.user.firstName} {student.user.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Time Filter */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Time
                        </label>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="all">All Assignments</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past Due</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {selectedStudent === "all" ? "All Assignments" :
                            `${students.find(s => s.id === selectedStudent)?.user.firstName}'s Assignments`}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {filteredAssignments.length} assignment(s) found
                    </p>
                </div>

                <div className="p-6">
                    {filteredAssignments.length > 0 ? (
                        <div className="space-y-4">
                            {filteredAssignments.map((assignment) => (
                                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {assignment.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {assignment.description}
                                            </p>

                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="font-medium">{assignment.class.subjectName}</span>
                                                <span>•</span>
                                                <span>
                                                    {assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}
                                                </span>
                                                <span>•</span>
                                                <span>Grade {assignment.class.section.gradeLevel}</span>
                                                <span>•</span>
                                                <span className="font-medium">
                                                    Due: {formatDate(assignment.dueDate)}
                                                </span>
                                                {assignment.maxScore && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Max Score: {assignment.maxScore}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Student Submissions */}
                                    <div className="border-t border-gray-200 pt-3">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Student Submissions:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {students
                                                .filter(student =>
                                                    selectedStudent === "all" || student.id === selectedStudent
                                                )
                                                .map(student => {
                                                    const status = getSubmissionStatus(assignment, student.id);
                                                    const submission = getStudentSubmission(assignment, student.id);

                                                    return (
                                                        <div
                                                            key={student.id}
                                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <span className="font-medium text-sm">
                                                                    {student.user.firstName} {student.user.lastName}
                                                                </span>
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                                                                    {getStatusText(status)}
                                                                </span>
                                                            </div>

                                                            <div className="text-right text-xs text-gray-500">
                                                                {submission?.submittedAt && (
                                                                    <div>Submitted: {formatDate(submission.submittedAt)}</div>
                                                                )}
                                                                {submission?.score !== null && assignment.maxScore && (
                                                                    <div className="font-semibold">
                                                                        Score: {submission.score}/{assignment.maxScore}
                                                                    </div>
                                                                )}
                                                                {submission?.fileUrl && (
                                                                    <a
                                                                        href={submission.fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                                    >
                                                                        View File
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>

                                    {/* Teacher Feedback */}
                                    {assignment.submissions.some(sub => sub.feedback) && (
                                        <div className="border-t border-gray-200 pt-3 mt-3">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Teacher Feedback:</h4>
                                            <div className="space-y-2">
                                                {assignment.submissions
                                                    .filter(sub => sub.feedback)
                                                    .map(submission => (
                                                        <div key={submission.id} className="bg-blue-50 border border-blue-200 rounded p-2">
                                                            <div className="text-sm font-medium text-blue-800 mb-1">
                                                                {submission.student.user.firstName}:
                                                            </div>
                                                            <div className="text-sm text-blue-700">
                                                                {submission.feedback}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No assignments found</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Try adjusting your filters or check back later
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}