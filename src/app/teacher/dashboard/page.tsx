import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

interface TeacherDashboardData {
    teacher: {
        employeeNumber: string;
        joinedDate: Date;
        user: {
            firstName: string;
            lastName: string;
        };
    };
    classCount: number;
    studentCount: number;
    recentAttendance: { present: number; total: number };
    upcomingClasses: Array<{
        id: string;
        subjectName: string;
        section: {
            name: string;
            gradeLevel: number;
        };
        schedule: string | null;
    }>;
}

export default async function TeacherDashboardPage() {
    const session = await requireSession(["TEACHER", "ADMIN"]);

    const dashboardData: TeacherDashboardData = await prisma.$transaction(async (tx) => {
        // First, get the teacher ID
        const teacher = await tx.teacher.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                employeeNumber: true,
                joinedDate: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        /*if (!teacher) {
            throw new Error("Teacher not found");
        }*/

        // Get classes with their sections and student counts
        const classes = await tx.class.findMany({
            where: {
                teacherId: teacher.id,
            },
            include: {
                section: {
                    select: {
                        name: true,
                        gradeLevel: true,
                        _count: {
                            select: {
                                students: true,
                            },
                        },
                    },
                },
            },
        });

        // Calculate student count across all classes - FIXED: Handle null/undefined
        const studentCount = classes.reduce((total, classItem) => {
            return total + (classItem.section._count?.students || 0);
        }, 0);

        // Get recent attendance stats (last 7 days)
        const recentAttendance = await tx.attendance.aggregate({
            where: {
                teacherId: teacher.id,
                date: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
            _count: {
                _all: true,
            },
        });

        // Get upcoming classes (next 3)
        const upcomingClasses = classes.slice(0, 3).map(classItem => ({
            id: classItem.id,
            subjectName: classItem.subjectName,
            section: {
                name: classItem.section.name,
                gradeLevel: classItem.section.gradeLevel,
            },
            schedule: classItem.schedule,
        }));

        return {
            teacher: {
                employeeNumber: teacher.employeeNumber,
                joinedDate: teacher.joinedDate,
                user: teacher.user,
            },
            classCount: classes.length,
            studentCount,
            recentAttendance: {
                present: 0, // You'd calculate this based on status
                total: recentAttendance._count._all,
            },
            upcomingClasses,
        };
    });

    return (
        <div className="container mx-auto p-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {dashboardData.teacher.user.firstName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Teacher #{dashboardData.teacher.employeeNumber} •
                    Joined {dashboardData.teacher.joinedDate.toLocaleDateString()}
                    <LogoutButton />
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-blue-600">{dashboardData.classCount}</div>
                    <div className="text-sm text-gray-600">Classes</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-green-600">{dashboardData.studentCount}</div>
                    <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-purple-600">
                        {dashboardData.recentAttendance.total}
                    </div>
                    <div className="text-sm text-gray-600">Recent Attendance Records</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-orange-600">
                        {dashboardData.upcomingClasses.length}
                    </div>
                    <div className="text-sm text-gray-600">Upcoming Classes</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                    href="/teacher/attendance"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Take Attendance</h3>
                            <p className="text-sm text-gray-500">Record daily attendance</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/teacher/grading"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Enter Grades</h3>
                            <p className="text-sm text-gray-500">Grade assignments</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/teacher/materials"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Learning Materials</h3>
                            <p className="text-sm text-gray-500">Upload resources</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/teacher/dashboard/announcements/create"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Create Announcement</h3>
                            <p className="text-sm text-gray-500">Share updates with students</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/teacher/dashboard/assignments/create"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Create Assignment</h3>
                            <p className="text-sm text-gray-500">Create new assignments</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Classes</h2>
                {dashboardData.upcomingClasses.length > 0 ? (
                    <div className="space-y-4">
                        {dashboardData.upcomingClasses.map((classItem) => (
                            <div key={classItem.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900">{classItem.subjectName}</h3>
                                    <p className="text-sm text-gray-500">
                                        Grade {classItem.section.gradeLevel} - {classItem.section.name}
                                    </p>
                                    {classItem.schedule && (
                                        <p className="text-sm text-gray-500">{classItem.schedule}</p>
                                    )}
                                </div>
                                <Link
                                    href={`/teacher/classes/${classItem.id}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View Class →
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No classes assigned yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}