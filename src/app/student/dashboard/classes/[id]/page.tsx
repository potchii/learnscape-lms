import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ClassDetails {
    id: string;
    subjectName: string;
    schedule: string | null;
    section: {
        name: string;
        gradeLevel: number;
    };
    teacher: {
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
        employeeNumber: string;
    };
    grades: Array<{
        id: string;
        score: number;
        remarks: string;
        gradedAt: Date;
    }>;
    attendance: Array<{
        id: string;
        date: Date;
        status: string;
        remarks: string | null;
    }>;
}

export default async function ClassDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
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

    const classDetails: ClassDetails | null = await prisma.class.findFirst({
        where: {
            id: params.id,
            sectionId: student.sectionId, // Ensure student is in this class's section
        },
        include: {
            section: true,
            teacher: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            },
            grades: {
                where: {
                    studentId: student.id,
                },
                orderBy: {
                    gradedAt: 'desc',
                },
            },
            attendance: {
                where: {
                    studentId: student.id,
                },
                orderBy: {
                    date: 'desc',
                },
            },
            // Removed learningMaterials as it doesn't exist in the Class model
        },
    });

    if (!classDetails) {
        notFound();
    }

    // Fetch learning materials separately since they're not directly related to Class in the schema
    const learningMaterials = await prisma.learningMaterial.findMany({
        where: {
            classId: params.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
    });

    // Calculate class statistics
    const averageGrade = classDetails.grades.length > 0
        ? classDetails.grades.reduce((sum, grade) => sum + grade.score, 0) / classDetails.grades.length
        : 0;

    const attendanceStats = {
        total: classDetails.attendance.length,
        present: classDetails.attendance.filter(a => a.status === 'PRESENT').length,
        absent: classDetails.attendance.filter(a => a.status === 'ABSENT').length,
        late: classDetails.attendance.filter(a => a.status === 'LATE').length,
        excused: classDetails.attendance.filter(a => a.status === 'EXCUSED').length,
    };

    const attendanceRate = attendanceStats.total > 0
        ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
        : 0;

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
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{classDetails.subjectName}</h1>
                        <p className="text-gray-600">
                            Grade {classDetails.section.gradeLevel} • {classDetails.section.name} Section
                        </p>
                        {classDetails.schedule && (
                            <p className="text-gray-500 mt-1">Schedule: {classDetails.schedule}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-blue-600">{classDetails.grades.length}</div>
                    <div className="text-sm text-gray-600">Grades</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-green-600">{averageGrade.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Average Grade</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-purple-600">{attendanceRate}%</div>
                    <div className="text-sm text-gray-600">Attendance</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-orange-600">{learningMaterials.length}</div>
                    <div className="text-sm text-gray-600">Materials</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Teacher Information */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Teacher Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {classDetails.teacher.user.firstName} {classDetails.teacher.user.lastName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-gray-900">{classDetails.teacher.user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                                <p className="text-gray-900">{classDetails.teacher.employeeNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="bg-white rounded-lg shadow p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Present</span>
                                <span className="font-semibold text-green-600">{attendanceStats.present}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Absent</span>
                                <span className="font-semibold text-red-600">{attendanceStats.absent}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Late</span>
                                <span className="font-semibold text-yellow-600">{attendanceStats.late}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Excused</span>
                                <span className="font-semibold text-purple-600">{attendanceStats.excused}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-700">Total Classes</span>
                                    <span className="font-semibold text-gray-900">{attendanceStats.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grades and Materials */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Grades */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Grades</h2>
                            <span className="text-sm text-gray-500">{classDetails.grades.length} total</span>
                        </div>

                        <div className="space-y-3">
                            {classDetails.grades.slice(0, 5).map((grade) => (
                                <div key={grade.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {grade.gradedAt.toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {grade.remarks || 'No remarks'}
                                        </p>
                                    </div>
                                    <span className={`text-lg font-bold ${grade.score >= 90 ? 'text-green-600' :
                                            grade.score >= 80 ? 'text-blue-600' :
                                                grade.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {grade.score}%
                                    </span>
                                </div>
                            ))}

                            {classDetails.grades.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No grades recorded for this class yet.</p>
                                </div>
                            )}

                            {classDetails.grades.length > 5 && (
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

                    {/* Learning Materials */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Materials</h2>

                        <div className="space-y-3">
                            {learningMaterials.map((material) => (
                                <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{material.title}</h3>
                                            {material.description && (
                                                <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                                            )}
                                            <div className="flex items-center space-x-2 mt-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${material.type === 'VIDEO' ? 'bg-red-100 text-red-800' :
                                                        material.type === 'DOCUMENT' ? 'bg-blue-100 text-blue-800' :
                                                            material.type === 'IMAGE' ? 'bg-green-100 text-green-800' :
                                                                'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {material.type.toLowerCase()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Posted {material.createdAt.toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <a
                                            href={material.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View →
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {learningMaterials.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No learning materials available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}