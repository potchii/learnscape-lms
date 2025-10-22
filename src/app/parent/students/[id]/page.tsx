import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User,
    BookOpen,
    TrendingUp,
    Calendar,
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    School
} from "lucide-react";

interface PageProps {
    params: {
        id: string;
    };
}

interface StudentWithDetails {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
        address: string;
        phoneNumber: string | null;
    };
    section: {
        id: string;
        gradeLevel: number;
        name: string;
    };
    parent: {
        id: string;
        parentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string | null;
        };
    };
    attendance: Array<{
        id: string;
        date: Date;
        status: string;
        class: {
            subjectName: string;
        };
    }>;
    grades: Array<{
        id: string;
        score: number;
        gradedAt: Date;
        class: {
            subjectName: string;
        };
        assignment: {
            title: string;
        } | null;
    }>;
    _count: {
        grades: number;
        attendance: number;
    };
}

export default async function StudentProfilePage({ params }: PageProps) {
    const session = await requireSession(['PARENT']);
    const { id } = params;

    const student = await prisma.student.findUnique({
        where: {
            id,
            parent: {
                userId: session.user.id, // Ensure the student belongs to the parent
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    gender: true,
                    birthdate: true,
                    address: true,
                    phoneNumber: true,
                },
            },
            section: true,
            parent: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true,
                        },
                    },
                },
            },
            attendance: {
                take: 50,
                orderBy: { date: 'desc' },
                include: {
                    class: {
                        select: {
                            subjectName: true,
                        },
                    },
                },
            },
            grades: {
                take: 20,
                orderBy: { gradedAt: 'desc' },
                include: {
                    class: {
                        select: {
                            subjectName: true,
                        },
                    },
                    assignment: {
                        select: {
                            title: true,
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
    });

    if (!student) {
        notFound();
    }

    const calculateAge = (birthdate: Date) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const getAttendanceStats = () => {
        const recentAttendance = student.attendance.slice(0, 30);
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

    const getGradeStats = () => {
        if (student.grades.length === 0) {
            return {
                average: 0,
                highest: 0,
                lowest: 0,
                total: 0,
            };
        }

        const scores = student.grades.map(grade => grade.score);
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);

        return {
            average: Math.round(average),
            highest: Math.round(highest),
            lowest: Math.round(lowest),
            total: scores.length,
        };
    };

    const attendanceStats = getAttendanceStats();
    const gradeStats = getGradeStats();

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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/parent/students" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Students
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {student.user.firstName} {student.user.lastName}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Grade {student.section.gradeLevel} - {student.section.name} • {student.studentNumber}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" asChild>
                                <Link href={`/parent/students/${student.id}/grades`}>
                                    View Grades
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/parent/students/${student.id}/attendance`}>
                                    View Attendance
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Student Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className={`text-2xl font-bold ${getAttendanceColor(attendanceStats.attendanceRate)}`}>
                                        {attendanceStats.attendanceRate}%
                                    </div>
                                    <p className="text-sm text-gray-600">Attendance</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className={`text-2xl font-bold ${getPerformanceColor(gradeStats.average)}`}>
                                        {gradeStats.average || 'N/A'}
                                    </div>
                                    <p className="text-sm text-gray-600">Avg Grade</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {gradeStats.total}
                                    </div>
                                    <p className="text-sm text-gray-600">Grades</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {attendanceStats.totalCount}
                                    </div>
                                    <p className="text-sm text-gray-600">Classes</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Email</p>
                                                <p className="text-sm text-gray-600">{student.user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Birthdate</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(student.user.birthdate).toLocaleDateString()}
                                                    ({calculateAge(student.user.birthdate)} years old)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Gender</p>
                                                <p className="text-sm text-gray-600 capitalize">{student.user.gender.toLowerCase()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {student.user.phoneNumber && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                                    <p className="text-sm text-gray-600">{student.user.phoneNumber}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Address</p>
                                                <p className="text-sm text-gray-600">{student.user.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <School className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Section</p>
                                                <p className="text-sm text-gray-600">
                                                    {student.section.name} (Grade {student.section.gradeLevel})
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Grades */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Recent Grades
                                </CardTitle>
                                <CardDescription>
                                    Latest academic performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {student.grades.length > 0 ? (
                                    <div className="space-y-3">
                                        {student.grades.slice(0, 5).map((grade) => (
                                            <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">
                                                        {grade.assignment?.title || grade.class.subjectName}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {grade.class.subjectName} • {new Date(grade.gradedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge className={`${getPerformanceColor(grade.score)}`}>
                                                    {Math.round(grade.score)}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>No grades recorded yet</p>
                                    </div>
                                )}

                                {student.grades.length > 5 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/parent/students/${student.id}/grades`}>
                                                View All Grades
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Parent & Attendance */}
                    <div className="space-y-6">
                        {/* Parent Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Parent/Guardian
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {student.parent.user.firstName} {student.parent.user.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">{student.parent.parentNumber}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{student.parent.user.email}</span>
                                        </div>

                                        {student.parent.user.phoneNumber && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{student.parent.user.phoneNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attendance Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Attendance Summary
                                </CardTitle>
                                <CardDescription>
                                    Last 30 class sessions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-green-600">Present</span>
                                        <span className="font-semibold">{attendanceStats.presentCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-yellow-600">Late</span>
                                        <span className="font-semibold">{attendanceStats.lateCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-red-600">Absent</span>
                                        <span className="font-semibold">{attendanceStats.absentCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-600">Excused</span>
                                        <span className="font-semibold">{attendanceStats.excusedCount}</span>
                                    </div>
                                </div>

                                {student.attendance.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/parent/students/${student.id}/attendance`}>
                                                View Full Attendance
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/parent/students/${student.id}/schedule`}>
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Class Schedule
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/parent/students/${student.id}/assignments`}>
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            Assignments
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact Teacher
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}