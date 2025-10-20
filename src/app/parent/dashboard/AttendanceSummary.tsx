import { Student, Attendance } from "@prisma/client";
import Link from "next/link";

interface StudentWithAttendance extends Student {
    user: {
        firstName: string;
        lastName: string;
    };
    attendance: Attendance[];
}

interface AttendanceSummaryProps {
    students: StudentWithAttendance[];
}

export function AttendanceSummary({ students }: AttendanceSummaryProps) {
    const getAttendanceStats = (student: StudentWithAttendance) => {
        const recentAttendance = student.attendance.slice(0, 10); // Last 10 records
        const presentCount = recentAttendance.filter(a => a.status === 'PRESENT').length;
        const absentCount = recentAttendance.filter(a => a.status === 'ABSENT').length;
        const lateCount = recentAttendance.filter(a => a.status === 'LATE').length;
        const totalCount = recentAttendance.length;

        const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

        return {
            presentCount,
            absentCount,
            lateCount,
            totalCount,
            attendanceRate,
            recentAttendance,
        };
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return 'text-green-600 bg-green-100';
            case 'ABSENT':
                return 'text-red-600 bg-red-100';
            case 'LATE':
                return 'text-orange-600 bg-orange-100';
            case 'EXCUSED':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return '✅';
            case 'ABSENT':
                return '❌';
            case 'LATE':
                return '⏰';
            case 'EXCUSED':
                return '📝';
            default:
                return '❓';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Attendance Summary</h2>
                <p className="text-sm text-gray-600 mt-1">Recent attendance records</p>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {students.map((student) => {
                        const stats = getAttendanceStats(student);

                        return (
                            <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-gray-900">
                                        {student.user.firstName} {student.user.lastName}
                                    </h3>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">
                                            {stats.attendanceRate.toFixed(0)}%
                                        </div>
                                        <div className="text-xs text-gray-500">Attendance Rate</div>
                                    </div>
                                </div>

                                {/* Attendance Stats */}
                                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                                    <div className="p-2 bg-green-50 rounded">
                                        <div className="font-semibold text-green-700">{stats.presentCount}</div>
                                        <div className="text-xs text-green-600">Present</div>
                                    </div>
                                    <div className="p-2 bg-red-50 rounded">
                                        <div className="font-semibold text-red-700">{stats.absentCount}</div>
                                        <div className="text-xs text-red-600">Absent</div>
                                    </div>
                                    <div className="p-2 bg-orange-50 rounded">
                                        <div className="font-semibold text-orange-700">{stats.lateCount}</div>
                                        <div className="text-xs text-orange-600">Late</div>
                                    </div>
                                </div>

                                {/* Recent Attendance */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700">Recent Records</h4>
                                    {stats.recentAttendance.length > 0 ? (
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                            {stats.recentAttendance.map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{getStatusIcon(record.status)}</span>
                                                        <span className="font-medium">
                                                            {record.date.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                                                        {record.status.toLowerCase()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 text-center py-2">
                                            No attendance records yet
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href={`/parent/student/${student.id}/attendance`}
                                    className="block w-full mt-3 text-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    View Full Attendance
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {students.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No students with attendance records</p>
                    </div>
                )}
            </div>
        </div>
    );
}