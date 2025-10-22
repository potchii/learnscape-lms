import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

interface StudentWithDetails {
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
    _count: {
        grades: number;
        attendance: number;
    };
}

export default async function ParentStudentsPage() {
    const session = await requireSession(['PARENT']);

    const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
        include: {
            students: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    section: true,
                    attendance: {
                        take: 30,
                        orderBy: { date: 'desc' },
                    },
                    grades: {
                        include: {
                            class: {
                                select: {
                                    subjectName: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            grades: true,
                            attendance: true,
                        },
                    },
                },
            },
        },
    });

    if (!parent) {
        return <div>Parent not found</div>;
    }

    const students: StudentWithDetails[] = parent.students;

    const getStudentStats = (student: StudentWithDetails) => {
        const recentAttendance = student.attendance.slice(0, 20);
        const presentCount = recentAttendance.filter(a => a.status === 'PRESENT').length;
        const attendanceRate = recentAttendance.length > 0 ? (presentCount / recentAttendance.length) * 100 : 0;

        const averageGrade = student.grades.length > 0
            ? student.grades.reduce((sum, grade) => sum + grade.score, 0) / student.grades.length
            : 0;

        return {
            attendanceRate: Math.round(attendanceRate),
            averageGrade: Math.round(averageGrade),
            totalGrades: student._count.grades,
            totalAttendance: student._count.attendance,
        };
    };

    const getPerformanceColor = (grade: number) => {
        if (grade >= 90) return "text-green-600 bg-green-100";
        if (grade >= 80) return "text-blue-600 bg-blue-100";
        if (grade >= 70) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    const getAttendanceColor = (rate: number) => {
        if (rate >= 95) return "text-green-600 bg-green-100";
        if (rate >= 90) return "text-blue-600 bg-blue-100";
        if (rate >= 85) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
                    <p className="text-gray-600 mt-2">
                        Detailed profiles and academic progress for each child
                    </p>
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => {
                        const stats = getStudentStats(student);

                        return (
                            <Card key={student.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-lg">
                                                    {student.user.firstName[0]}{student.user.lastName[0]}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <CardTitle className="text-xl">
                                                {student.user.firstName} {student.user.lastName}
                                            </CardTitle>
                                            <CardDescription>
                                                Grade {student.section.gradeLevel} - {student.section.name}
                                            </CardDescription>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {student.studentNumber}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center p-3 rounded-lg bg-gray-50">
                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getAttendanceColor(stats.attendanceRate)} mb-2`}>
                                                <TrendingUp className="h-5 w-5" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {stats.attendanceRate}%
                                            </div>
                                            <p className="text-xs text-gray-600">Attendance</p>
                                        </div>

                                        <div className="text-center p-3 rounded-lg bg-gray-50">
                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getPerformanceColor(stats.averageGrade)} mb-2`}>
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {stats.averageGrade || 'N/A'}
                                            </div>
                                            <p className="text-xs text-gray-600">Avg Grade</p>
                                        </div>
                                    </div>

                                    {/* Additional Stats */}
                                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">{stats.totalGrades}</div>
                                            <div>Grades</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">{stats.totalAttendance}</div>
                                            <div>Classes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">
                                                {student.user.email.split('@')[0].length > 8
                                                    ? student.user.email.split('@')[0].substring(0, 8) + '...'
                                                    : student.user.email.split('@')[0]
                                                }
                                            </div>
                                            <div>Email</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        <Link href={`/parent/students/${student.id}`} className="w-full">
                                            <Button className="w-full" size="sm">
                                                View Full Profile
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>

                                        <div className="flex gap-2">
                                            <Link href={`/parent/students/${student.id}/grades`} className="flex-1">
                                                <Button variant="outline" className="w-full" size="sm">
                                                    Grades
                                                </Button>
                                            </Link>
                                            <Link href={`/parent/students/${student.id}/attendance`} className="flex-1">
                                                <Button variant="outline" className="w-full" size="sm">
                                                    Attendance
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {students.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                            <p className="text-gray-600 mb-4">
                                You don't have any students associated with your account.
                            </p>
                            <Button>
                                Contact Administration
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}