import { Student, Assignment, AssignmentSubmission } from "@prisma/client";

interface StudentWithUser extends Student {
    user: {
        firstName: string;
        lastName: string;
        email: string;
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
    };
    submissions: AssignmentSubmission[];
}

interface IncompleteTasksAlertsProps {
    students: StudentWithUser[];
    assignments: AssignmentWithDetails[];
}

export function IncompleteTasksAlerts({ students, assignments }: IncompleteTasksAlertsProps) {
    const now = new Date();

    // Find incomplete assignments
    const incompleteAssignments = assignments.filter(assignment => {
        const isPastDue = assignment.dueDate < now;
        const hasIncompleteSubmission = students.some(student => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return !submission || submission.status === 'NOT_SUBMITTED';
        });

        return isPastDue && hasIncompleteSubmission;
    });

    // Group by student
    const studentAlerts = students.map(student => {
        const studentIncomplete = incompleteAssignments.filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return !submission || submission.status === 'NOT_SUBMITTED';
        });

        return {
            student,
            incompleteCount: studentIncomplete.length,
            assignments: studentIncomplete,
        };
    }).filter(alert => alert.incompleteCount > 0);

    if (studentAlerts.length === 0) {
        return null;
    }

    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-orange-800">
                        Incomplete Assignments Alert
                    </h3>
                    <div className="mt-2 space-y-2">
                        {studentAlerts.map((alert, index) => (
                            <div key={alert.student.id} className="text-sm text-orange-700">
                                <p className="font-medium">
                                    {alert.student.user.firstName} {alert.student.user.lastName}:
                                    <span className="ml-1">{alert.incompleteCount} missing assignment(s)</span>
                                </p>
                                {alert.assignments.slice(0, 3).map(assignment => (
                                    <p key={assignment.id} className="ml-4 text-xs">
                                        • {assignment.title} ({assignment.class.subjectName}) - Due {assignment.dueDate.toLocaleDateString()}
                                    </p>
                                ))}
                                {alert.assignments.length > 3 && (
                                    <p className="ml-4 text-xs text-orange-600">
                                        • ...and {alert.assignments.length - 3} more
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}