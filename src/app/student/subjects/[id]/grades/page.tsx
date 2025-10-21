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

export default async function SubjectGradesPage({ params }: PageProps) {
    const session = await requireSession(["STUDENT"]);
    const classId = params.id;

    // Get student
    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
        },
    });

    if (!student) {
        notFound();
    }

    // Get class
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
        },
    });

    if (!classData) {
        notFound();
    }

    // Get grades for this student in this class WITH assignment data
    const grades = await prisma.grade.findMany({
        where: {
            studentId: student.id,
            classId: classId,
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
            assignment: {
                select: {
                    id: true,
                    title: true,
                    maxScore: true,
                    dueDate: true,
                },
            },
        },
        orderBy: {
            gradedAt: 'desc',
        },
    });

    // Calculate overall grade statistics
    const gradeStats = calculateGradeStats(grades);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/student/subjects/${classId}`}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Subject
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Grades - {classData.subjectName}</h1>
                    <p className="text-gray-600 mt-2">Your performance in {classData.subjectName}</p>
                </div>

                {/* Grade Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{gradeStats.average}%</div>
                        <div className="text-sm text-gray-600">Average</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{gradeStats.highest}%</div>
                        <div className="text-sm text-gray-600">Highest</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{gradeStats.lowest}%</div>
                        <div className="text-sm text-gray-600">Lowest</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{gradeStats.total}</div>
                        <div className="text-sm text-gray-600">Total Grades</div>
                    </div>
                </div>

                {/* All Grades */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">All Grades</h2>
                        <p className="text-gray-600 mt-1">Complete history of your graded assessments</p>
                    </div>

                    <div className="p-6">
                        {grades.length > 0 ? (
                            <div className="space-y-4">
                                {grades.map((grade) => (
                                    <div
                                        key={grade.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {grade.assignment?.title || `Assessment`}
                                            </h3>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                <span>
                                                    Score: {grade.score}
                                                    {grade.assignment?.maxScore && ` / ${grade.assignment.maxScore}`}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    Graded on {new Date(grade.gradedAt).toLocaleDateString()}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    By {grade.teacher.user.firstName} {grade.teacher.user.lastName}
                                                </span>
                                            </div>
                                            {grade.remarks && (
                                                <p className="text-sm text-gray-600 mt-2 italic">
                                                    "{grade.remarks}"
                                                </p>
                                            )}
                                        </div>

                                        <div className={`text-lg font-semibold ${getGradeColor(calculatePercentage(grade.score, grade.assignment?.maxScore))
                                            }`}>
                                            {calculatePercentage(grade.score, grade.assignment?.maxScore)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-gray-400 mb-3">
                                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No grades yet</h3>
                                <p className="text-gray-500">Your grades will appear here once assessments are graded.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Summary */}
                {grades.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">Performance Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-blue-800">
                                    <span className="font-medium">Current Average:</span> {gradeStats.average}%
                                </p>
                                <p className="text-blue-800">
                                    <span className="font-medium">Letter Grade:</span> {calculateLetterGrade(gradeStats.average)}
                                </p>
                                <p className="text-blue-800">
                                    <span className="font-medium">Graded Items:</span> {gradeStats.completed} of {gradeStats.total}
                                </p>
                            </div>
                            <div>
                                <p className="text-blue-800">
                                    <span className="font-medium">Performance:</span> {getPerformanceText(gradeStats.average)}
                                </p>
                                <p className="text-blue-800">
                                    <span className="font-medium">Grade Range:</span> {gradeStats.lowest}% - {gradeStats.highest}%
                                </p>
                                <p className="text-blue-800">
                                    <span className="font-medium">Teacher:</span> {classData.teacher.user.firstName} {classData.teacher.user.lastName}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Update the calculatePercentage function to handle undefined
function calculatePercentage(score: number, maxScore: number | null | undefined): number {
    if (!maxScore || maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
}

function calculateGradeStats(grades: any[]) {
    if (grades.length === 0) {
        return {
            average: 0,
            highest: 0,
            lowest: 0,
            total: 0,
            completed: 0,
        };
    }

    // Only calculate for grades that have assignments and valid maxScore
    const validGrades = grades.filter(grade =>
        grade.assignment && grade.assignment.maxScore && grade.assignment.maxScore > 0
    );

    if (validGrades.length === 0) {
        return {
            average: 0,
            highest: 0,
            lowest: 0,
            total: grades.length,
            completed: 0,
        };
    }

    const percentages = validGrades.map(grade =>
        calculatePercentage(grade.score, grade.assignment.maxScore)
    );

    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);

    return {
        average: Math.round(average * 100) / 100,
        highest: Math.round(highest * 100) / 100,
        lowest: Math.round(lowest * 100) / 100,
        total: grades.length,
        completed: validGrades.length,
    };
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