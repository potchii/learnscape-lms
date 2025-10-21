// src/components/student/dashboard/subjects/SubjectGrades.tsx
import Link from "next/link";

interface SubjectGradesProps {
    grades: any[];
    gradeStats: {
        average: number;
        highest: number;
        lowest: number;
        total: number;
        completed: number;
    };
    classId: string;
}

export function SubjectGrades({ grades, gradeStats, classId }: SubjectGradesProps) {
    return (
        <div className="space-y-6">
            {/* Grade Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            {/* Recent Grades */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Grade History</h2>
                            <p className="text-gray-600 mt-1">Your graded assessments</p>
                        </div>
                        <Link
                            href={`/student/subjects/${classId}/grades`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                </div>

                <div className="p-6">
                    {grades.length > 0 ? (
                        <div className="space-y-4">
                            {grades.slice(0, 5).map((grade) => (
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

                    {grades.length > 5 && (
                        <div className="mt-4 text-center">
                            <Link
                                href={`/student/subjects/${classId}/grades`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View all {grades.length} grades →
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Performance Summary */}
            {grades.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-blue-800">
                                <span className="font-medium">Current Average:</span> {gradeStats.average}%
                            </p>
                            <p className="text-blue-800">
                                <span className="font-medium">Letter Grade:</span> {calculateLetterGrade(gradeStats.average)}
                            </p>
                        </div>
                        <div>
                            <p className="text-blue-800">
                                <span className="font-medium">Performance:</span> {getPerformanceText(gradeStats.average)}
                            </p>
                            <p className="text-blue-800">
                                <span className="font-medium">Graded Items:</span> {gradeStats.completed} of {gradeStats.total}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper functions
function calculatePercentage(score: number, maxScore: number | null | undefined): number {
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