import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface GradeWithDetails {
    id: string;
    score: number;
    remarks: string;
    gradedAt: Date;
    class: {
        id: string;
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

export default async function StudentGradesPage() {
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

    const grades: GradeWithDetails[] = await prisma.grade.findMany({
        where: {
            studentId: student.id,
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
            gradedAt: 'desc',
        },
    });

    // Calculate statistics
    const totalGrades = grades.length;
    const averageGrade = totalGrades > 0
        ? grades.reduce((sum, grade) => sum + grade.score, 0) / totalGrades
        : 0;

    const gradeDistribution = {
        A: grades.filter(g => g.score >= 90).length,
        B: grades.filter(g => g.score >= 80 && g.score < 90).length,
        C: grades.filter(g => g.score >= 70 && g.score < 80).length,
        D: grades.filter(g => g.score >= 60 && g.score < 70).length,
        F: grades.filter(g => g.score < 60).length,
    };

    // Group grades by subject
    const gradesBySubject = grades.reduce((acc, grade) => {
        const subject = grade.class.subjectName;
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(grade);
        return acc;
    }, {} as Record<string, GradeWithDetails[]>);

    // Calculate subject averages
    const subjectAverages = Object.entries(gradesBySubject).map(([subject, subjectGrades]) => {
        const average = subjectGrades.reduce((sum, grade) => sum + grade.score, 0) / subjectGrades.length;
        return { subject, average: average.toFixed(1), count: subjectGrades.length };
    });

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
                <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
                <p className="text-gray-600">
                    Grade {student.section.gradeLevel} • {student.section.name} Section
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-blue-600">{totalGrades}</div>
                    <div className="text-sm text-gray-600">Total Grades</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-green-600">{averageGrade.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Average Grade</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-purple-600">{gradeDistribution.A}</div>
                    <div className="text-sm text-gray-600">A Grades</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-orange-600">{Object.keys(gradesBySubject).length}</div>
                    <div className="text-sm text-gray-600">Subjects</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subject Averages */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Averages</h2>
                        <div className="space-y-3">
                            {subjectAverages.map(({ subject, average, count }) => (
                                <div key={subject} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{subject}</p>
                                        <p className="text-sm text-gray-500">{count} grades</p>
                                    </div>
                                    <span className={`text-lg font-bold ${parseFloat(average) >= 90 ? 'text-green-600' :
                                            parseFloat(average) >= 80 ? 'text-blue-600' :
                                                parseFloat(average) >= 70 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {average}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grade Distribution */}
                    <div className="bg-white rounded-lg shadow p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Grade Distribution</h2>
                        <div className="space-y-2">
                            {Object.entries(gradeDistribution).map(([letter, count]) => (
                                <div key={letter} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">{letter}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${letter === 'A' ? 'bg-green-500' :
                                                        letter === 'B' ? 'bg-blue-500' :
                                                            letter === 'C' ? 'bg-yellow-500' :
                                                                letter === 'D' ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${(count / totalGrades) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* All Grades List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">All Grades</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teacher
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Grade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Remarks
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {grades.map((grade) => (
                                        <tr key={grade.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {grade.class.subjectName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {grade.class.teacher.user.firstName} {grade.class.teacher.user.lastName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${grade.score >= 90 ? 'bg-green-100 text-green-800' :
                                                        grade.score >= 80 ? 'bg-blue-100 text-blue-800' :
                                                            grade.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                                                grade.score >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {grade.score}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {grade.remarks || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {grade.gradedAt.toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {grades.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">No grades recorded yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}