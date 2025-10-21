// src/app/student/subjects/[id]/grades/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function GradesPage({ params }: PageProps) {
    const session = await requireSession(["STUDENT", "ADMIN"]);
    const classId = params.id;

    // Get student and verify access
    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
        },
    });

    if (!student) {
        notFound();
    }

    // Get class info
    const classData = await prisma.class.findUnique({
        where: {
            id: classId,
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
            section: {
                select: {
                    name: true,
                    gradeLevel: true,
                },
            },
        },
    });

    if (!classData) {
        notFound();
    }

    // Get all grades for this student in this class
    const grades = await prisma.grade.findMany({
        where: {
            studentId: student.id,
            classId: classId,
        },
        include: {
            assignment: {
                select: {
                    title: true,
                    maxScore: true,
                    dueDate: true,
                },
            },
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
            gradedAt: 'desc',
        },
    });

    // Calculate statistics
    const stats = calculateGradeStats(grades);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <Link
                            href={`/student/subjects/${classId}`}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to {classData.subjectName}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Grades - {classData.subjectName}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Grade {classData.section.gradeLevel} • {classData.section.name}
                    </p>
                </div>

                {/* Grade Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.average}%</div>
                        <div className="text-sm text-gray-600">Average Grade</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.highest}%</div>
                        <div className="text-sm text-gray-600">Highest Grade</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.lowest}%</div>
                        <div className="text-sm text-gray-600">Lowest Grade</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Graded</div>
                    </div>
                </div>

                {/* Grades Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Grade History</h2>
                        <p className="text-gray-600 mt-1">All your graded assignments and assessments</p>
                    </div>

                    <div className="p-6">
                        {grades.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Assignment
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Due Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Percentage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Graded By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date Graded
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {grades.map((grade) => (
                                            <tr key={grade.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {grade.assignment?.title || 'Unknown Assignment'}
                                                    </div>
                                                    {grade.assignment?.maxScore && (
                                                        <div className="text-sm text-gray-500">
                                                            Out of {grade.assignment.maxScore} points
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {grade.assignment?.dueDate
                                                        ? new Date(grade.assignment.dueDate).toLocaleDateString()
                                                        : 'N/A'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {grade.score}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm font-semibold ${getGradeColor(calculatePercentage(grade.score, grade.assignment?.maxScore))
                                                        }`}>
                                                        {calculatePercentage(grade.score, grade.assignment?.maxScore)}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {grade.teacher.user.firstName} {grade.teacher.user.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(grade.gradedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No grades yet</h3>
                                <p className="text-gray-500">Your grades will appear here once assignments are graded.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grade Summary */}
                {grades.length > 0 && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">Grade Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-blue-800">
                                    <span className="font-medium">Current Average:</span> {stats.average}%
                                </p>
                                <p className="text-blue-800">
                                    <span className="font-medium">Grading Scale:</span> A (90-100), B (80-89), C (70-79), D (60-69), F (0-59)
                                </p>
                            </div>
                            <div>
                                <p className="text-blue-800">
                                    <span className="font-medium">Performance:</span> {getPerformanceText(stats.average)}
                                </p>
                                <p className="text-blue-800">
                                    <span className="font-medium">Letter Grade:</span> {calculateLetterGrade(stats.average)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper functions
function calculateGradeStats(grades: any[]) {
    if (grades.length === 0) {
        return {
            average: 0,
            highest: 0,
            lowest: 0,
            total: 0,
        };
    }

    const percentages = grades.map(grade =>
        calculatePercentage(grade.score, grade.assignment?.maxScore)
    );

    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);

    return {
        average: Math.round(average * 100) / 100,
        highest: Math.round(highest * 100) / 100,
        lowest: Math.round(lowest * 100) / 100,
        total: grades.length,
    };
}

function calculatePercentage(score: number, maxScore: number | null): number {
    if (!maxScore || maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
}

function getGradeColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
}

function calculateLetterGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

function getPerformanceText(average: number): string {
    if (average >= 90) return 'Excellent';
    if (average >= 80) return 'Good';
    if (average >= 70) return 'Satisfactory';
    if (average >= 60) return 'Needs Improvement';
    return 'At Risk';
}