// src/app/teacher/gradebook/[classId]/GradebookTable.tsx
'use client';

import { useState } from 'react';

interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
    grades: Array<{
        id: string;
        score: number;
        assignment: {
            id: string;
            title: string;
            maxScore: number | null;
        } | null;
    }>;
}

interface Assignment {
    id: string;
    title: string;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    submissions: Array<{
        id: string;
    }>;
}

interface Props {
    students: Student[];
    assignments: Assignment[];
    classId: string;
}

export default function GradebookTable({ students, assignments }: Props) {
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    const calculateStudentAverage = (student: Student) => {
        // Get all grades that have an assignment (regardless of maxScore)
        const validGrades = student.grades.filter(grade => {
            return grade.assignment !== null; // Only require that the grade has an assignment
        });

        if (validGrades.length === 0) {
            return null; // No grades at all
        }

        // For grades without maxScore, assume a default (e.g., 100)
        const DEFAULT_MAX_SCORE = 100;

        const totalPoints = validGrades.reduce((sum, grade) => sum + grade.score, 0);
        const totalMaxPoints = validGrades.reduce((sum, grade) => {
            const maxScore = grade.assignment!.maxScore || DEFAULT_MAX_SCORE;
            return sum + maxScore;
        }, 0);

        return totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : 0;
    };

    const getGradeForAssignment = (student: Student, assignmentId: string) => {
        const grade = student.grades.find(g => g.assignment?.id === assignmentId);
        return grade || null;
    };

    const getGradeColor = (score: number, maxScore: number | null) => {
        // If no maxScore, we can't calculate percentage, so use default color
        if (!maxScore) return 'text-gray-900';

        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return 'text-green-600 font-semibold';
        if (percentage >= 80) return 'text-blue-600';
        if (percentage >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Calculate average color (similar logic but for percentages)
    const getAverageColor = (average: number) => {
        if (average >= 90) return 'text-green-600';
        if (average >= 80) return 'text-blue-600';
        if (average >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                                Student
                            </th>
                            {assignments.map((assignment) => (
                                <th
                                    key={assignment.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                                >
                                    <div className="flex flex-col">
                                        <span className="truncate" title={assignment.title}>
                                            {assignment.title}
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1">
                                            {assignment.maxScore ? `/ ${assignment.maxScore}` : 'No max score'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Average
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => {
                            const average = calculateStudentAverage(student);

                            return (
                                <tr
                                    key={student.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setExpandedStudent(
                                        expandedStudent === student.id ? null : student.id
                                    )}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.user.firstName} {student.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {student.studentNumber}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {assignments.map((assignment) => {
                                        const grade = getGradeForAssignment(student, assignment.id);

                                        return (
                                            <td key={assignment.id} className="px-6 py-4 whitespace-nowrap">
                                                {grade ? (
                                                    <div className={`text-sm ${getGradeColor(grade.score, assignment.maxScore)}`}>
                                                        {grade.score}
                                                        {assignment.maxScore && (
                                                            <span className="text-gray-500 ml-1">
                                                                / {assignment.maxScore}
                                                            </span>
                                                        )}
                                                        {!assignment.maxScore && (
                                                            <span className="text-gray-400 ml-1 text-xs">
                                                                (no max)
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {average !== null ? (
                                            <div className={`text-sm font-medium ${getAverageColor(average)}`}>
                                                {average.toFixed(1)}%
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {students.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No students enrolled in this class.</p>
                </div>
            )}
        </div>
    );
}