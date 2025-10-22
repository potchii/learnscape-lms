import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, TrendingUp, AlertTriangle } from "lucide-react";

interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
    attendance: Array<{
        date: Date;
        status: string;
    }>;
    grades: Array<{
        score: number;
        class: {
            subjectName: string;
        };
    }>;
}

interface Assignment {
    id: string;
    title: string;
    description?: string | null; // Make description optional
    dueDate: Date;
    class: {
        subjectName: string;
        section: {
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        studentId: string;
        status: string;
    }>;
}

interface StudentOverviewProps {
    students: Student[];
    assignments: Assignment[];
}

export function StudentOverview({ students, assignments }: StudentOverviewProps) {
    const getStudentStats = (student: Student) => {
        const recentAttendance = student.attendance.slice(0, 10); // Last 10 records
        const presentCount = recentAttendance.filter(a => a.status === 'PRESENT').length;
        const attendanceRate = recentAttendance.length > 0 ? (presentCount / recentAttendance.length) * 100 : 0;

        const studentGrades = student.grades;
        const averageGrade = studentGrades.length > 0
            ? studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length
            : 0;

        const studentAssignments = assignments.filter(assignment =>
            assignment.class.section.gradeLevel === student.section.gradeLevel
        );

        const pendingAssignments = studentAssignments.filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return !submission || submission.status === 'NOT_SUBMITTED';
        }).length;

        return {
            attendanceRate: Math.round(attendanceRate),
            averageGrade: Math.round(averageGrade),
            pendingAssignments,
        };
    };

    const getPerformanceColor = (grade: number) => {
        if (grade >= 90) return "text-green-600";
        if (grade >= 80) return "text-blue-600";
        if (grade >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getAttendanceColor = (rate: number) => {
        if (rate >= 95) return "text-green-600";
        if (rate >= 90) return "text-blue-600";
        if (rate >= 85) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    My Students
                </CardTitle>
                <CardDescription>
                    Overview of your children's academic progress
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {students.map((student) => {
                        const stats = getStudentStats(student);

                        return (
                            <div
                                key={student.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold">
                                                {student.user.firstName[0]}{student.user.lastName[0]}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {student.user.firstName} {student.user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Grade {student.section.gradeLevel} - {student.section.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6 text-sm">
                                    {/* Attendance */}
                                    <div className="text-center">
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="h-4 w-4 text-gray-400" />
                                            <span className={`font-semibold ${getAttendanceColor(stats.attendanceRate)}`}>
                                                {stats.attendanceRate}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">Attendance</p>
                                    </div>

                                    {/* Average Grade */}
                                    <div className="text-center">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            <span className={`font-semibold ${getPerformanceColor(stats.averageGrade)}`}>
                                                {stats.averageGrade || 'N/A'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">Avg Grade</p>
                                    </div>

                                    {/* Pending Assignments */}
                                    <div className="text-center">
                                        <div className="flex items-center gap-1">
                                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                                            <span className={`font-semibold ${stats.pendingAssignments > 0 ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {stats.pendingAssignments}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">Pending</p>
                                    </div>

                                    {/* View Details Button */}
                                    <Link href={`/parent/students/${student.id}`}>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {students.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No students found</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}