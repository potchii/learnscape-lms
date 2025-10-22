// src/app/teacher/dashboard/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function TeacherDashboardPage() {
    const session = await requireSession(["TEACHER"]);

    // Get teacher data for dashboard
    const teacher = await prisma.teacher.findFirst({
        where: { userId: session.user.id },
        include: {
            classes: {
                include: {
                    section: {
                        select: {
                            name: true,
                        },
                    },
                    Assignment: {
                        include: {
                            submissions: {
                                where: {
                                    status: 'SUBMITTED',
                                },
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
                        orderBy: {
                            dueDate: 'asc',
                        },
                    },
                },
            },
        },
    });

    if (!teacher) {
        return <div>Teacher not found</div>;
    }

    // Calculate pending submissions
    const pendingSubmissions = teacher.classes.flatMap(cls =>
        cls.Assignment.flatMap(assignment =>
            assignment.submissions.map(submission => ({
                ...submission,
                assignmentTitle: assignment.title,
                className: cls.subjectName,
            }))
        )
    );

    // Upcoming deadlines (next 7 days)
    const upcomingDeadlines = teacher.classes.flatMap(cls =>
        cls.Assignment
            .filter(assignment => {
                const dueDate = new Date(assignment.dueDate);
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                return dueDate <= nextWeek && dueDate >= new Date();
            })
            .map(assignment => ({
                ...assignment,
                className: cls.subjectName,
                sectionName: cls.section.name,
            }))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of your teaching activities and pending tasks</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pending Submissions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Pending Submissions</h2>
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {pendingSubmissions.length} pending
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            {pendingSubmissions.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingSubmissions.slice(0, 5).map((submission) => (
                                        <div key={submission.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{submission.assignmentTitle}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {submission.student.user.firstName} {submission.student.user.lastName} • {submission.className}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Submitted: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/teacher/assignments/${submission.assignmentId}/grading`}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                            >
                                                Grade
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No pending submissions</p>
                                </div>
                            )}
                            {pendingSubmissions.length > 5 && (
                                <div className="mt-4 text-center">
                                    <Link href="/teacher/gradebook" className="text-blue-600 hover:text-blue-800 font-medium">
                                        View all pending submissions →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
                        </div>
                        <div className="p-6">
                            {upcomingDeadlines.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingDeadlines.map((assignment) => (
                                        <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {assignment.className} • {assignment.sectionName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {assignment.submissions.length} submissions
                                                </div>
                                                <Link
                                                    href={`/teacher/assignments/${assignment.id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No upcoming deadlines</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link
                                href="/teacher/announcements/create"
                                className="flex items-center space-x-2 w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-xl">📢</span>
                                <span>Create Announcement</span>
                            </Link>
                            <Link
                                href="/teacher/assignments/create"
                                className="flex items-center space-x-2 w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-xl">📝</span>
                                <span>Create Assignment</span>
                            </Link>
                            <Link
                                href="/teacher/gradebook"
                                className="flex items-center space-x-2 w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-xl">📊</span>
                                <span>View Gradebook</span>
                            </Link>
                        </div>
                    </div>

                    {/* Class Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Summary</h3>
                        <div className="space-y-4">
                            {teacher.classes.map((classItem) => (
                                <div key={classItem.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900">{classItem.subjectName}</p>
                                        <p className="text-sm text-gray-600">{classItem.section.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {classItem.Assignment.length} assignments
                                        </p>
                                        <Link
                                            href={`/teacher/classes/${classItem.id}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Manage
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}