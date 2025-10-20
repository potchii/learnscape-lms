import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface AttendanceRecord {
    id: string;
    date: Date;
    status: string;
    remarks: string | null;
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

export default async function StudentAttendancePage() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
        },
    });

    if (!student) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Student Record Not Found</h2>
                    <p className="text-red-600">We couldn't find your student information.</p>
                </div>
            </div>
        );
    }

    // Get attendance records for the current academic year
    const currentYear = new Date().getFullYear();
    const academicYearStart = new Date(currentYear, 7, 1); // August 1st
    const academicYearEnd = new Date(currentYear + 1, 5, 30); // June 30th next year

    const attendanceRecords: AttendanceRecord[] = await prisma.attendance.findMany({
        where: {
            studentId: student.id,
            date: {
                gte: academicYearStart,
                lte: academicYearEnd,
            },
        },
        include: {
            class: {
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
            },
        },
        orderBy: {
            date: 'desc',
        },
    });

    // Calculate statistics
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendanceRecords.filter(a => a.status === 'ABSENT').length;
    const lateCount = attendanceRecords.filter(a => a.status === 'LATE').length;
    const excusedCount = attendanceRecords.filter(a => a.status === 'EXCUSED').length;
    const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    // Group by month for trends
    const monthlyData = attendanceRecords.reduce((acc, record) => {
        const month = record.date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = { present: 0, total: 0 };
        }
        acc[month].total++;
        if (record.status === 'PRESENT') {
            acc[month].present++;
        }
        return acc;
    }, {} as Record<string, { present: number; total: number }>);

    // Get recent records (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAttendance = attendanceRecords.filter(record => record.date >= thirtyDaysAgo);

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <Link
                        href="/student/dashboard"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
                <p className="text-gray-600">
                    Grade {student.section.gradeLevel} • {student.section.name} Section
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                    <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
                    <div className="text-sm text-gray-600">Late</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-purple-600">{excusedCount}</div>
                    <div className="text-sm text-gray-600">Excused</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Trends */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Trends</h2>
                        <div className="space-y-4">
                            {Object.entries(monthlyData).slice(0, 6).map(([month, data]) => {
                                const monthlyRate = Math.round((data.present / data.total) * 100);
                                return (
                                    <div key={month} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">{month}</span>
                                            <span className="text-gray-600">{monthlyRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${monthlyRate >= 90 ? 'bg-green-500' :
                                                        monthlyRate >= 80 ? 'bg-blue-500' :
                                                            monthlyRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${monthlyRate}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 text-right">
                                            {data.present}/{data.total} days
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Attendance */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Attendance (Last 30 Days)</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teacher
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentAttendance.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.date.toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.class.subjectName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {record.class.teacher.user.firstName} {record.class.teacher.user.lastName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                                        record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                                                            record.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.remarks || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {recentAttendance.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">No attendance records found for the last 30 days.</p>
                            </div>
                        )}
                    </div>

                    {/* All Attendance Records */}
                    {attendanceRecords.length > recentAttendance.length && (
                        <div className="mt-6 bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">All Attendance Records</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Showing {recentAttendance.length} recent records. There are {attendanceRecords.length} total records for this academic year.
                                </p>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    View Full Attendance History
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}