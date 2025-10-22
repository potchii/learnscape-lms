import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    attendance: Array<{
        date: Date;
        status: string;
    }>;
}

interface AttendanceSummaryProps {
    students: Student[];
}

export function AttendanceSummary({ students }: AttendanceSummaryProps) {
    const getAttendanceStats = (student: Student) => {
        const recentAttendance = student.attendance.slice(0, 20); // Last 20 records

        const presentCount = recentAttendance.filter(a => a.status === 'PRESENT').length;
        const absentCount = recentAttendance.filter(a => a.status === 'ABSENT').length;
        const lateCount = recentAttendance.filter(a => a.status === 'LATE').length;
        const excusedCount = recentAttendance.filter(a => a.status === 'EXCUSED').length;

        const totalCount = recentAttendance.length;
        const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

        return {
            presentCount,
            absentCount,
            lateCount,
            excusedCount,
            totalCount,
            attendanceRate: Math.round(attendanceRate),
        };
    };

    const getOverallStats = () => {
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLate = 0;
        let totalExcused = 0;
        let totalRecords = 0;

        students.forEach(student => {
            const stats = getAttendanceStats(student);
            totalPresent += stats.presentCount;
            totalAbsent += stats.absentCount;
            totalLate += stats.lateCount;
            totalExcused += stats.excusedCount;
            totalRecords += stats.totalCount;
        });

        const overallRate = totalRecords > 0 ? ((totalPresent + totalExcused) / totalRecords) * 100 : 0;

        return {
            totalPresent,
            totalAbsent,
            totalLate,
            totalExcused,
            totalRecords,
            overallRate: Math.round(overallRate),
        };
    };

    const overallStats = getOverallStats();

    const getRateColor = (rate: number) => {
        if (rate >= 95) return "text-green-600";
        if (rate >= 90) return "text-blue-600";
        if (rate >= 85) return "text-yellow-600";
        return "text-red-600";
    };

    const getRateBgColor = (rate: number) => {
        if (rate >= 95) return "bg-green-100";
        if (rate >= 90) return "bg-blue-100";
        if (rate >= 85) return "bg-yellow-100";
        return "bg-red-100";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Attendance Summary
                </CardTitle>
                <CardDescription>
                    Recent attendance across all students
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Overall Attendance Rate */}
                <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getRateBgColor(overallStats.overallRate)} mb-2`}>
                        <span className={`text-2xl font-bold ${getRateColor(overallStats.overallRate)}`}>
                            {overallStats.overallRate}%
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">Overall Attendance Rate</p>
                </div>

                {/* Attendance Breakdown */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Present</span>
                        </div>
                        <span className="font-semibold text-green-600">
                            {overallStats.totalPresent}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">Late</span>
                        </div>
                        <span className="font-semibold text-yellow-600">
                            {overallStats.totalLate}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">Absent</span>
                        </div>
                        <span className="font-semibold text-red-600">
                            {overallStats.totalAbsent}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Excused</span>
                        </div>
                        <span className="font-semibold text-blue-600">
                            {overallStats.totalExcused}
                        </span>
                    </div>
                </div>

                {/* Individual Student Rates */}
                {students.length > 1 && (
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-3">By Student</h4>
                        <div className="space-y-2">
                            {students.map((student) => {
                                const stats = getAttendanceStats(student);
                                return (
                                    <div key={student.id} className="flex items-center justify-between text-sm">
                                        <span className="truncate">
                                            {student.user.firstName} {student.user.lastName[0]}.
                                        </span>
                                        <span className={`font-semibold ${getRateColor(stats.attendanceRate)}`}>
                                            {stats.attendanceRate}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}