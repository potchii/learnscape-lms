import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle, FileText, BookOpen } from "lucide-react";

interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}

interface Assignment {
    id: string;
    title: string;
    description?: string | null; // Make description optional
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
        section: {
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        studentId: string;
        status: string;
        submittedAt: Date | null;
    }>;
}

interface UpcomingDeadlinesProps {
    assignments: Assignment[];
    students: Student[];
}

export function UpcomingDeadlines({ assignments, students }: UpcomingDeadlinesProps) {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Filter assignments due in the next 7 days
    const upcomingAssignments = assignments
        .filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            return dueDate >= now && dueDate <= oneWeekFromNow;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 10); // Limit to 10 assignments

    // Get overdue assignments
    const overdueAssignments = assignments
        .filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            return dueDate < now;
        })
        .filter(assignment => {
            // Only show if not submitted or submitted late
            const relevantSubmissions = assignment.submissions.filter(sub =>
                students.some(student => student.id === sub.studentId)
            );
            return relevantSubmissions.some(sub =>
                !sub.submittedAt || sub.status === 'NOT_SUBMITTED'
            );
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5); // Limit to 5 overdue assignments

    const getDaysUntilDue = (dueDate: Date): string => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        return `In ${diffDays} days`;
    };

    const getUrgencyColor = (dueDate: Date, isOverdue: boolean = false) => {
        if (isOverdue) return 'text-red-600 bg-red-100';

        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'text-red-600 bg-red-100';
        if (diffDays <= 3) return 'text-yellow-600 bg-yellow-100';
        return 'text-blue-600 bg-blue-100';
    };

    const getSubmissionStatus = (assignment: Assignment, studentId: string) => {
        const submission = assignment.submissions.find(sub => sub.studentId === studentId);
        if (!submission) return 'NOT_SUBMITTED';
        return submission.status;
    };

    const getStudentForAssignment = (assignment: Assignment) => {
        return students.find(student =>
            student.section.gradeLevel === assignment.class.section.gradeLevel &&
            student.section.name === assignment.class.section.name
        );
    };

    if (upcomingAssignments.length === 0 && overdueAssignments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Deadlines
                    </CardTitle>
                    <CardDescription>
                        Assignments and tasks due soon
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No upcoming deadlines</p>
                        <p className="text-sm mt-1">All caught up!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </div>
                    {overdueAssignments.length > 0 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {overdueAssignments.length} overdue
                        </Badge>
                    )}
                </div>
                <CardDescription>
                    Assignments and tasks due soon
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Overdue Assignments */}
                {overdueAssignments.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Overdue Assignments
                        </h4>
                        <div className="space-y-3">
                            {overdueAssignments.map((assignment) => {
                                const student = getStudentForAssignment(assignment);
                                const submissionStatus = student ? getSubmissionStatus(assignment, student.id) : 'NOT_SUBMITTED';

                                return (
                                    <div
                                        key={assignment.id}
                                        className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50"
                                    >
                                        <div className="flex items-start space-x-3 flex-1">
                                            <FileText className="h-4 w-4 text-red-500 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-sm text-gray-900">
                                                        {assignment.title}
                                                    </p>
                                                    <Badge variant="destructive" className="text-xs">
                                                        Overdue
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-gray-600 space-y-1">
                                                    <p>
                                                        <span className="font-medium">Subject:</span> {assignment.class.subjectName}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Student:</span> {student?.user.firstName} {student?.user.lastName}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Due:</span> {new Date(assignment.dueDate).toLocaleDateString()}
                                                    </p>
                                                    <p className={`font-medium ${submissionStatus === 'SUBMITTED' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        Status: {submissionStatus === 'SUBMITTED' ? 'Submitted (Late)' : 'Not Submitted'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Upcoming Assignments */}
                {upcomingAssignments.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Due This Week
                        </h4>
                        <div className="space-y-3">
                            {upcomingAssignments.map((assignment) => {
                                const student = getStudentForAssignment(assignment);
                                const submissionStatus = student ? getSubmissionStatus(assignment, student.id) : 'NOT_SUBMITTED';
                                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                                const isUrgent = daysUntilDue === 'Today' || daysUntilDue === 'Tomorrow';

                                return (
                                    <div
                                        key={assignment.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start space-x-3 flex-1">
                                            <BookOpen className="h-4 w-4 text-blue-500 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-sm text-gray-900">
                                                        {assignment.title}
                                                    </p>
                                                    <Badge
                                                        variant={isUrgent ? "destructive" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {daysUntilDue}
                                                    </Badge>
                                                    {submissionStatus === 'SUBMITTED' && (
                                                        <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                                                            Submitted
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-600 space-y-1">
                                                    <p>
                                                        <span className="font-medium">Subject:</span> {assignment.class.subjectName}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Student:</span> {student?.user.firstName} {student?.user.lastName}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Teacher:</span> {assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Due:</span> {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                                                        {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            {submissionStatus === 'NOT_SUBMITTED' && (
                                                <Badge variant="outline" className="text-red-600 border-red-200">
                                                    Not Submitted
                                                </Badge>
                                            )}
                                            {assignment.maxScore && (
                                                <span className="text-xs text-gray-500">
                                                    {assignment.maxScore} pts
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* View All Link */}
                {(upcomingAssignments.length > 5 || overdueAssignments.length > 0) && (
                    <div className="mt-4 pt-4 border-t">
                        <Link href="/parent/assignments">
                            <Button variant="outline" size="sm" className="w-full">
                                View All Assignments
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}