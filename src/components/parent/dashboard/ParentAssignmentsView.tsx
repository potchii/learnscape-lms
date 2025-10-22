'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Calendar, User, BookOpen, Search, Filter, Download, Eye } from "lucide-react";

interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        id: string; // Add section id
        gradeLevel: number;
        name: string;
    };
}

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    class: {
        id: string;
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        section: {
            id: string; // Add section id
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        id: string;
        studentId: string;
        status: string;
        submittedAt: Date | null;
        score: number | null;
        feedback: string | null;
    }>;
}

interface ParentAssignmentsViewProps {
    students: Student[];
    assignments: Assignment[];
}

type FilterType = 'all' | 'overdue' | 'due-this-week' | 'submitted' | 'not-submitted';
type SortType = 'due-date' | 'subject' | 'student' | 'status';

export function ParentAssignmentsView({ students, assignments }: ParentAssignmentsViewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sort, setSort] = useState<SortType>('due-date');
    const [selectedStudent, setSelectedStudent] = useState<string>('all');

    const now = new Date();

    const filteredAssignments = assignments.filter(assignment => {
        // Search filter
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.class.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.class.teacher.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.class.teacher.user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Student filter
        if (selectedStudent !== 'all') {
            const studentSection = students.find(s => s.id === selectedStudent)?.section.id; // Fix: use section.id
            if (assignment.class.section.id !== studentSection) { // Fix: use assignment.class.section.id
                return false;
            }
        }

        // Status filter
        switch (filter) {
            case 'overdue':
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = dueDate < now;
                if (!isOverdue) return false;

                return assignment.submissions.some(submission =>
                    students.some(s => s.id === submission.studentId) &&
                    submission.status !== 'SUBMITTED'
                );

            case 'due-this-week':
                const dueDateThisWeek = new Date(assignment.dueDate);
                const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return dueDateThisWeek >= now && dueDateThisWeek <= oneWeekFromNow;

            case 'submitted':
                return assignment.submissions.some(submission =>
                    students.some(s => s.id === submission.studentId) &&
                    submission.status === 'SUBMITTED'
                );

            case 'not-submitted':
                const relevantStudents = selectedStudent === 'all'
                    ? students
                    : students.filter(s => s.id === selectedStudent);

                return relevantStudents.some(student => {
                    const submission = assignment.submissions.find(sub => sub.studentId === student.id);
                    return !submission || submission.status !== 'SUBMITTED';
                });

            default:
                return true;
        }
    });

    // Sort assignments
    const sortedAssignments = [...filteredAssignments].sort((a, b) => {
        switch (sort) {
            case 'due-date':
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

            case 'subject':
                return a.class.subjectName.localeCompare(b.class.subjectName);

            case 'student':
                const aStudent = students.find(s =>
                    a.submissions.some(sub => sub.studentId === s.id)
                )?.user.lastName || '';
                const bStudent = students.find(s =>
                    b.submissions.some(sub => sub.studentId === s.id)
                )?.user.lastName || '';
                return aStudent.localeCompare(bStudent);

            case 'status':
                const aStatus = getOverallStatus(a);
                const bStatus = getOverallStatus(b);
                return aStatus.localeCompare(bStatus);

            default:
                return 0;
        }
    });

    const getDaysUntilDue = (dueDate: Date): string => {
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        return `In ${diffDays} days`;
    };

    const getUrgencyColor = (dueDate: Date) => {
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'text-red-600 bg-red-100';
        if (diffDays <= 1) return 'text-red-600 bg-red-100';
        if (diffDays <= 3) return 'text-yellow-600 bg-yellow-100';
        return 'text-blue-600 bg-blue-100';
    };

    const getSubmissionStatus = (assignment: Assignment, studentId: string) => {
        const submission = assignment.submissions.find(sub => sub.studentId === studentId);
        if (!submission) return 'NOT_SUBMITTED';
        return submission.status;
    };

    const getOverallStatus = (assignment: Assignment): string => {
        const relevantSubmissions = assignment.submissions.filter(sub =>
            students.some(s => s.id === sub.studentId)
        );

        if (relevantSubmissions.length === 0) return 'NOT_SUBMITTED';

        const allSubmitted = relevantSubmissions.every(sub => sub.status === 'SUBMITTED');
        const anySubmitted = relevantSubmissions.some(sub => sub.status === 'SUBMITTED');

        if (allSubmitted) return 'ALL_SUBMITTED';
        if (anySubmitted) return 'SOME_SUBMITTED';

        return 'NONE_SUBMITTED';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ALL_SUBMITTED':
                return 'text-green-600 bg-green-100';
            case 'SOME_SUBMITTED':
                return 'text-yellow-600 bg-yellow-100';
            case 'NONE_SUBMITTED':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ALL_SUBMITTED':
                return 'All Submitted';
            case 'SOME_SUBMITTED':
                return 'Some Submitted';
            case 'NONE_SUBMITTED':
                return 'Not Submitted';
            default:
                return 'Unknown';
        }
    };

    const getStudentForAssignment = (assignment: Assignment) => {
        return students.find(student =>
            student.section.id === assignment.class.section.id // Fix: use student.section.id and assignment.class.section.id
        );
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search assignments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as FilterType)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="all">All Assignments</option>
                                <option value="overdue">Overdue</option>
                                <option value="due-this-week">Due This Week</option>
                                <option value="submitted">Submitted</option>
                                <option value="not-submitted">Not Submitted</option>
                            </select>

                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="all">All Students</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.user.firstName} {student.user.lastName}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortType)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="due-date">Due Date</option>
                                <option value="subject">Subject</option>
                                <option value="student">Student</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assignments List */}
            <div className="space-y-4">
                {sortedAssignments.length > 0 ? (
                    sortedAssignments.map((assignment) => {
                        const overallStatus = getOverallStatus(assignment);
                        const student = getStudentForAssignment(assignment);
                        const daysUntilDue = getDaysUntilDue(assignment.dueDate);

                        return (
                            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                        {assignment.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen className="h-4 w-4" />
                                                            <span>{assignment.class.subjectName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            <span>
                                                                {assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}
                                                            </span>
                                                        </div>
                                                        {student && (
                                                            <div className="flex items-center gap-1">
                                                                <User className="h-4 w-4" />
                                                                <span>{student.user.firstName} {student.user.lastName}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Badge className={getUrgencyColor(assignment.dueDate)}>
                                                        {daysUntilDue}
                                                    </Badge>
                                                    <Badge className={getStatusColor(overallStatus)}>
                                                        {getStatusText(overallStatus)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {assignment.description && (
                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {assignment.description}
                                                </p>
                                            )}

                                            {/* Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-900">Due Date:</span>
                                                    <p className="text-gray-600">
                                                        {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                                                        {new Date(assignment.dueDate).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>

                                                {assignment.maxScore && (
                                                    <div>
                                                        <span className="font-medium text-gray-900">Max Score:</span>
                                                        <p className="text-gray-600">{assignment.maxScore} points</p>
                                                    </div>
                                                )}

                                                <div>
                                                    <span className="font-medium text-gray-900">Student Status:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {students
                                                            .filter(s => s.section.id === assignment.class.section.id) // Fix: use s.section.id and assignment.class.section.id
                                                            .map(student => {
                                                                const status = getSubmissionStatus(assignment, student.id);
                                                                return (
                                                                    <Badge
                                                                        key={student.id}
                                                                        variant={status === 'SUBMITTED' ? 'default' : 'secondary'}
                                                                        className={`text-xs ${status === 'SUBMITTED'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : 'bg-gray-100 text-gray-700'
                                                                            }`}
                                                                    >
                                                                        {student.user.firstName}: {status === 'SUBMITTED' ? '✓' : '✗'}
                                                                    </Badge>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Grades */}
                                            {assignment.submissions.some(sub => sub.score !== null) && (
                                                <div className="mt-4">
                                                    <span className="font-medium text-gray-900">Grades:</span>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {assignment.submissions
                                                            .filter(sub => students.some(s => s.id === sub.studentId) && sub.score !== null)
                                                            .map(submission => {
                                                                const student = students.find(s => s.id === submission.studentId);
                                                                return (
                                                                    <Badge key={submission.id} variant="outline" className="text-xs">
                                                                        {student?.user.firstName}: {submission.score}
                                                                        {assignment.maxScore && `/${assignment.maxScore}`}
                                                                    </Badge>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 ml-4">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" />
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filter !== 'all' || selectedStudent !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'No assignments have been assigned yet'
                                }
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Summary */}
            {sortedAssignments.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Showing {sortedAssignments.length} of {assignments.length} assignments
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    All Submitted: {assignments.filter(a => getOverallStatus(a) === 'ALL_SUBMITTED').length}
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    Some Submitted: {assignments.filter(a => getOverallStatus(a) === 'SOME_SUBMITTED').length}
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    Not Submitted: {assignments.filter(a => getOverallStatus(a) === 'NONE_SUBMITTED').length}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}