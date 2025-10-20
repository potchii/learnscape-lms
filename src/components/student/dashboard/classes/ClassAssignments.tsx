import { Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";

interface AssignmentWithSubmissions extends Assignment {
    submissions: AssignmentSubmission[];
}

interface ClassAssignmentsProps {
    assignments: AssignmentWithSubmissions[];
    studentId: string;
}

export function ClassAssignments({ assignments, studentId }: ClassAssignmentsProps) {
    const getStatus = (assignment: AssignmentWithSubmissions) => {
        const submission = assignment.submissions[0];
        const now = new Date();

        if (!submission || submission.status === 'NOT_SUBMITTED') {
            return assignment.dueDate < now ? 'missed' : 'not_submitted';
        }
        return submission.status.toLowerCase();
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Class Homework</h2>
                <p className="text-sm text-gray-600 mt-1">Your assignments and progress</p>
            </div>

            <div className="p-6">
                {assignments.length > 0 ? (
                    <div className="space-y-4">
                        {assignments.map((assignment) => {
                            const status = getStatus(assignment);
                            const submission = assignment.submissions[0];

                            return (
                                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                                <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${status === 'graded' ? 'bg-green-100 text-green-800' :
                                                        status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                                            status === 'missed' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {status === 'graded' ? '✅ Graded' :
                                                        status === 'submitted' ? '📤 Submitted' :
                                                            status === 'missed' ? '❌ Missed' :
                                                                '📝 To Do'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/student/assignments/${assignment.id}`}
                                            className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No homework assigned yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}