import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface StudentWithDetails {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
        address: string;
        phoneNumber: string | null;
        createdAt: Date;
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
    section: {
        id: string;
        name: string;
        gradeLevel: number;
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
    }>;
}

export default async function StudentProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const session = await requireSession("ADMIN");

    const student: StudentWithDetails | null = await prisma.student.findUnique({
        where: { id: params.id },
        include: {
            user: true,
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
            section: true,
            attendance: {
                include: {
                    class: {
                        select: {
                            subjectName: true,
                        },
                    },
                },
                orderBy: {
                    date: "desc",
                },
                take: 5,
            },
            grades: {
                include: {
                    class: {
                        select: {
                            subjectName: true,
                        },
                    },
                },
                orderBy: {
                    gradedAt: "desc",
                },
                take: 5,
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
        const total = student.attendance.length;
        const present = student.attendance.filter(a => a.status === "PRESENT").length;
        const absent = student.attendance.filter(a => a.status === "ABSENT").length;
        const late = student.attendance.filter(a => a.status === "LATE").length;

        return { total, present, absent, late };
    };

    const getGradeStats = () => {
        const total = student.grades.length;
        const average = total > 0
            ? student.grades.reduce((sum, grade) => sum + grade.score, 0) / total
            : 0;

        return { total, average: average.toFixed(1) };
    };

    const attendanceStats = getAttendanceStats();
    const gradeStats = getGradeStats();

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link
                                href={`/admin/sections/${student.section.id}/students`}
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Section
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                    {student.user.firstName[0]}{student.user.lastName[0]}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {student.user.firstName} {student.user.middleName && `${student.user.middleName} `}{student.user.lastName}
                                </h1>
                                <p className="text-gray-600">
                                    {student.studentNumber} • Grade {student.section.gradeLevel} • {student.section.name} Section
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Link
                            href={`/admin/students/${student.id}/edit`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Edit Student
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Student Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Full Name</label>
                                <p className="text-sm text-gray-900">
                                    {student.user.firstName} {student.user.middleName && `${student.user.middleName} `}{student.user.lastName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Student ID</label>
                                <p className="text-sm font-mono text-gray-900">{student.studentNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-sm text-gray-900">{student.user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-sm text-gray-900">{student.user.phoneNumber || "Not provided"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                <p className="text-sm text-gray-900">
                                    {student.user.birthdate.toLocaleDateString()} ({calculateAge(student.user.birthdate)} years old)
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Gender</label>
                                <p className="text-sm text-gray-900 capitalize">{student.user.gender.toLowerCase()}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-sm text-gray-900">{student.user.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Grade Level</label>
                                <p className="text-sm text-gray-900">Grade {student.section.gradeLevel}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Section</label>
                                <p className="text-sm text-gray-900">{student.section.name} Section</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                                <p className="text-sm text-gray-900">{student.user.createdAt.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Stats & Parent Info */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Recent Attendance</label>
                                <p className="text-2xl font-bold text-gray-900">
                                    {attendanceStats.present}/{attendanceStats.total}
                                </p>
                                <p className="text-sm text-gray-500">Present in last 5 records</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Average Grade</label>
                                <p className="text-2xl font-bold text-gray-900">{gradeStats.average}</p>
                                <p className="text-sm text-gray-500">Based on {gradeStats.total} grades</p>
                            </div>
                        </div>
                    </div>

                    {/* Parent/Guardian Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent/Guardian</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <p className="text-sm text-gray-900">
                                    {student.parent.user.firstName} {student.parent.user.lastName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Parent ID</label>
                                <p className="text-sm font-mono text-gray-900">{student.parent.parentNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-sm text-gray-900">{student.parent.user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-sm text-gray-900">{student.parent.user.phoneNumber || "Not provided"}</p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href={`/admin/parents/${student.parent.id}`}
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View Parent Profile →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-3">
                            {student.grades.slice(0, 3).map((grade) => (
                                <div key={grade.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{grade.class.subjectName}</p>
                                        <p className="text-xs text-gray-500">Grade: {grade.score}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {grade.gradedAt.toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                            {student.grades.length === 0 && (
                                <p className="text-sm text-gray-500">No recent activity</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}