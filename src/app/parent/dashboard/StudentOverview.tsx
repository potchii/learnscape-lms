import { Student, Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";

interface StudentWithUser extends Student {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}

interface AssignmentWithDetails extends Assignment {
    class: {
        subjectName: string;
    };
    submissions: AssignmentSubmission[];
}

interface StudentOverviewProps {
    students: StudentWithUser[];
    assignments: AssignmentWithDetails[];
}

export function StudentOverview({ students, assignments }: StudentOverviewProps) {
    const now = new Date();

    const getStudentStats = (student: StudentWithUser) => {
        const studentAssignments = assignments.filter(assignment =>
            assignment.submissions.some(sub => sub.studentId === student.id)
        );

        const totalAssignments = studentAssignments.length;
        const submittedAssignments = studentAssignments.filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return submission && submission.status !== 'NOT_SUBMITTED';
        }).length;

        const gradedAssignments = studentAssignments.filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return submission && submission.status === 'GRADED';
        }).length;

        const upcomingAssignments = assignments.filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return assignment.dueDate > now && (!submission || submission.status === 'NOT_SUBMITTED');
        }).length;

        return {
            totalAssignments,
            submittedAssignments,
            gradedAssignments,
            upcomingAssignments,
            submissionRate: totalAssignments > 0 ? (submittedAssignments / totalAssignments) * 100 : 0,
        };
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Student Overview</h2>
                <p className="text-sm text-gray-600 mt-1">Academic progress for your children</p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {students.map((student) => {
                        const stats = getStudentStats(student);

                        return (
                            <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {student.user.firstName} {student.user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Grade {student.section.gradeLevel} - {student.section.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{student.user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {stats.submissionRate.toFixed(0)}%
                                        </div>
                                        <div className="text-xs text-gray-500">Submission Rate</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${stats.submissionRate}%` }}
                                    ></div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                                        <div className="font-semibold text-blue-700">{stats.totalAssignments}</div>
                                        <div className="text-xs text-blue-600">Total Assignments</div>
                                    </div>
                                    <div className="text-center p-2 bg-green-50 rounded-lg">
                                        <div className="font-semibold text-green-700">{stats.submittedAssignments}</div>
                                        <div className="text-xs text-green-600">Submitted</div>
                                    </div>
                                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                                        <div className="font-semibold text-purple-700">{stats.gradedAssignments}</div>
                                        <div className="text-xs text-purple-600">Graded</div>
                                    </div>
                                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                                        <div className="font-semibold text-orange-700">{stats.upcomingAssignments}</div>
                                        <div className="text-xs text-orange-600">Upcoming</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-4 flex space-x-2">
                                    <Link
                                        href={`/parent/student/${student.id}/assignments`}
                                        className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View Assignments
                                    </Link>
                                    <Link
                                        href={`/parent/student/${student.id}/attendance`}
                                        className="flex-1 text-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Attendance
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {students.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No students assigned to your account.</p>
                        <p className="text-gray-400 text-sm mt-1">Contact school administration to add students.</p>
                    </div>
                )}
            </div>
        </div>
    );
}