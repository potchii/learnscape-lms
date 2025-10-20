import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

interface StudentDashboardData {
    student: {
        id: string;
        studentNumber: string;
        section: {
            id: string;
            name: string;
            gradeLevel: number;
        };
    };
    classes: Array<{
        id: string;
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        schedule: string | null;
    }>;
    recentGrades: Array<{
        id: string;
        score: number;
        remarks: string;
        gradedAt: Date;
        class: {
            subjectName: string;
        };
    }>;
    attendanceStats: {
        total: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendanceRate: number;
    };
    upcomingAssignments: Array<{
        id: string;
        title: string;
        dueDate: Date;
        class: {
            subjectName: string;
        };
    }>;
}

export default async function StudentDashboard() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    // Fetch student data
    const dashboardData: StudentDashboardData | null = await prisma.$transaction(async (tx) => {
        // Get student record
        const student = await tx.student.findFirst({
            where: { userId: session.user.id },
            include: {
                section: true,
            },
        });

        if (!student) {
            return null;
        }

        // Get classes for the student's section
        const classes = await tx.class.findMany({
            where: {
                sectionId: student.sectionId,
            },
            include: {
                teacher: {
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
            orderBy: {
                subjectName: 'asc',
            },
        });

        // Get recent grades (last 10)
        const recentGrades = await tx.grade.findMany({
            where: {
                studentId: student.id,
            },
            include: {
                class: {
                    select: {
                        subjectName: true,
                    },
                },
            },
            orderBy: {
                gradedAt: 'desc',
            },
            take: 10,
        });

        // Get attendance statistics (current academic year)
        const currentYear = new Date().getFullYear();
        const academicYearStart = new Date(currentYear, 7, 1); // August 1st
        const academicYearEnd = new Date(currentYear + 1, 5, 30); // June 30th next year

        const attendanceRecords = await tx.attendance.findMany({
            where: {
                studentId: student.id,
                date: {
                    gte: academicYearStart,
                    lte: academicYearEnd,
                },
            },
        });

        const attendanceStats = {
            total: attendanceRecords.length,
            present: attendanceRecords.filter(a => a.status === 'PRESENT').length,
            absent: attendanceRecords.filter(a => a.status === 'ABSENT').length,
            late: attendanceRecords.filter(a => a.status === 'LATE').length,
            excused: attendanceRecords.filter(a => a.status === 'EXCUSED').length,
            attendanceRate: attendanceRecords.length > 0
                ? Math.round((attendanceRecords.filter(a => a.status === 'PRESENT').length / attendanceRecords.length) * 100)
                : 0,
        };

        // Mock upcoming assignments (replace with real assignment queries later)
        const upcomingAssignments = [
            {
                id: '1',
                title: 'Math Chapter 5 Exercises',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                class: { subjectName: 'Mathematics' },
            },
            {
                id: '2',
                title: 'Science Lab Report',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                class: { subjectName: 'Science' },
            },
        ];

        return {
            student,
            classes,
            recentGrades,
            attendanceStats,
            upcomingAssignments,
        };
    });

    if (!dashboardData) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Student Record Not Found</h2>
                    <p className="text-red-600">We couldn't find your student information. Please contact administration.</p>
                </div>
            </div>
        );
    }

    // Calculate average grade
    const averageGrade = dashboardData.recentGrades.length > 0
        ? dashboardData.recentGrades.reduce((sum, grade) => sum + grade.score, 0) / dashboardData.recentGrades.length
        : 0;

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {session.user.firstName}!
                        </h1>
                        <p className="text-gray-600">
                            {dashboardData.student.section.name} Section • Grade {dashboardData.student.section.gradeLevel} •
                            Student ID: {dashboardData.student.studentNumber}
                        </p>
                    </div>
                    <LogoutButton />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-blue-600">{dashboardData.classes.length}</div>
                    <div className="text-sm text-gray-600">Classes</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-green-600">
                        {dashboardData.attendanceStats.attendanceRate}%
                    </div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-purple-600">
                        {averageGrade.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Average Grade</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-orange-600">
                        {dashboardData.upcomingAssignments.length}
                    </div>
                    <div className="text-sm text-gray-600">Upcoming Assignments</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                    href="/student/classes"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
                            <p className="text-sm text-gray-500">View all classes</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/student/grades"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">My Grades</h3>
                            <p className="text-sm text-gray-500">View grade history</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/student/dashboard/assignments"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
                            <p className="text-sm text-gray-500">Track your work</p>
                        </div>
                    </div>
                </Link>

                {/* NEW: Announcements Link */}
                <Link
                    href="/student/dashboard/announcements"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                            <p className="text-sm text-gray-500">School updates</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Rest of your existing dashboard content remains the same */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Classes Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">My Classes</h2>
                        <span className="text-sm text-gray-500">{dashboardData.classes.length} classes</span>
                    </div>

                    <div className="space-y-4">
                        {dashboardData.classes.map((classItem) => (
                            <div key={classItem.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{classItem.subjectName}</h3>
                                        <p className="text-sm text-gray-600">
                                            {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                                        </p>
                                        {classItem.schedule && (
                                            <p className="text-sm text-gray-500 mt-1">{classItem.schedule}</p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/student/classes/${classItem.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {dashboardData.classes.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No classes assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Grades Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Grades</h2>

                    <div className="space-y-3">
                        {dashboardData.recentGrades.slice(0, 5).map((grade) => (
                            <div key={grade.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{grade.class.subjectName}</p>
                                    <p className="text-sm text-gray-500">
                                        {grade.remarks || 'No remarks'} • {grade.gradedAt.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${grade.score >= 90 ? 'text-green-600' :
                                        grade.score >= 80 ? 'text-blue-600' :
                                            grade.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {grade.score}%
                                    </span>
                                </div>
                            </div>
                        ))}

                        {dashboardData.recentGrades.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No grades recorded yet.</p>
                            </div>
                        )}

                        {dashboardData.recentGrades.length > 5 && (
                            <div className="text-center pt-4">
                                <Link
                                    href="/student/grades"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View All Grades →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attendance Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Overview</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Overall Attendance Rate</span>
                            <span className="text-lg font-semibold text-green-600">
                                {dashboardData.attendanceStats.attendanceRate}%
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-lg font-bold text-green-600">{dashboardData.attendanceStats.present}</div>
                                <div className="text-green-700">Present</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="text-lg font-bold text-red-600">{dashboardData.attendanceStats.absent}</div>
                                <div className="text-red-700">Absent</div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="text-lg font-bold text-yellow-600">{dashboardData.attendanceStats.late}</div>
                                <div className="text-yellow-700">Late</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-lg font-bold text-blue-600">{dashboardData.attendanceStats.excused}</div>
                                <div className="text-blue-700">Excused</div>
                            </div>
                        </div>

                        <Link
                            href="/student/attendance"
                            className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium pt-2"
                        >
                            View Detailed Attendance →
                        </Link>
                    </div>
                </div>

                {/* Upcoming Assignments */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Assignments</h2>

                    <div className="space-y-3">
                        {dashboardData.upcomingAssignments.map((assignment) => (
                            <div key={assignment.id} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">{assignment.title}</p>
                                        <p className="text-sm text-gray-600">{assignment.class.subjectName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-orange-600">
                                            Due {assignment.dueDate.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {dashboardData.upcomingAssignments.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No upcoming assignments.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}