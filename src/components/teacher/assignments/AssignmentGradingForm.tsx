// src/app/teacher/assignments/[id]/grading/AssignmentGradingForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
    submissions: Array<{
        id: string;
        fileUrl: string | null;
        submittedAt: Date | null;
        status: string;
    }>;
    grades: Array<{
        id: string;
        score: number;
        remarks: string;
    }>;
}

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    maxScore: number | null;
    dueDate: Date;
    class: {
        id: string;
        subjectName: string;
        section: {
            name: string;
            gradeLevel: number;
        };
    };
}

interface AssignmentGradingFormProps {
    assignment: Assignment;
    students: Student[];
}

export function AssignmentGradingForm({ assignment, students }: AssignmentGradingFormProps) {
    const router = useRouter();
    const [grades, setGrades] = useState<Record<string, { score: string; remarks: string }>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGradeChange = (studentId: string, field: string, value: string) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value,
            },
        }));
    };

    const handleSubmitGrade = async (studentId: string) => {
        const gradeData = grades[studentId];
        if (!gradeData?.score) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/teacher/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    classId: assignment.class.id,
                    assignmentId: assignment.id,
                    score: parseFloat(gradeData.score),
                    remarks: gradeData.remarks || '',
                }),
            });

            if (response.ok) {
                router.refresh();
                setGrades(prev => {
                    const newGrades = { ...prev };
                    delete newGrades[studentId];
                    return newGrades;
                });
            } else {
                console.error('Failed to submit grade');
            }
        } catch (error) {
            console.error('Error submitting grade:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkSubmit = async () => {
        setIsSubmitting(true);
        try {
            const gradePromises = Object.entries(grades)
                .filter(([_, gradeData]) => gradeData.score)
                .map(([studentId, gradeData]) =>
                    fetch('/api/teacher/grades', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            studentId,
                            classId: assignment.class.id,
                            assignmentId: assignment.id,
                            score: parseFloat(gradeData.score),
                            remarks: gradeData.remarks || '',
                        }),
                    })
                );

            await Promise.all(gradePromises);
            router.refresh();
            setGrades({});
        } catch (error) {
            console.error('Error submitting grades:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getExistingGrade = (student: Student) => {
        return student.grades[0];
    };

    const getSubmissionStatus = (student: Student) => {
        const submission = student.submissions[0];
        if (!submission) return { status: 'Not Submitted', color: 'text-red-600' };

        switch (submission.status) {
            case 'SUBMITTED':
                return { status: 'Submitted', color: 'text-blue-600' };
            case 'LATE':
                return { status: 'Late', color: 'text-orange-600' };
            case 'GRADED':
                return { status: 'Graded', color: 'text-green-600' };
            default:
                return { status: 'Not Submitted', color: 'text-red-600' };
        }
    };

    return (
        <div className="space-y-6">
            {/* Assignment Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h2>
                <p className="text-gray-600 mb-4">{assignment.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Subject:</span> {assignment.class.subjectName}
                    </div>
                    <div>
                        <span className="font-medium">Section:</span> Grade {assignment.class.section.gradeLevel} - {assignment.class.section.name}
                    </div>
                    <div>
                        <span className="font-medium">Max Score:</span> {assignment.maxScore || 'N/A'}
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Student Grades</h3>
                <button
                    onClick={handleBulkSubmit}
                    disabled={isSubmitting || Object.keys(grades).length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit All Grades'}
                </button>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submission Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current Grade
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    New Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Remarks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student) => {
                                const existingGrade = getExistingGrade(student);
                                const submissionStatus = getSubmissionStatus(student);

                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {student.user.firstName} {student.user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {student.studentNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${submissionStatus.color}`}>
                                                {submissionStatus.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {existingGrade ? `${existingGrade.score}${assignment.maxScore ? ` / ${assignment.maxScore}` : ''}` : 'Not graded'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max={assignment.maxScore || undefined}
                                                placeholder="Score"
                                                value={grades[student.id]?.score || ''}
                                                onChange={(e) => handleGradeChange(student.id, 'score', e.target.value)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {assignment.maxScore && (
                                                <span className="text-sm text-gray-500 ml-1">/ {assignment.maxScore}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                placeholder="Remarks (optional)"
                                                value={grades[student.id]?.remarks || ''}
                                                onChange={(e) => handleGradeChange(student.id, 'remarks', e.target.value)}
                                                className="w-48 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleSubmitGrade(student.id)}
                                                disabled={isSubmitting || !grades[student.id]?.score}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Grade
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {students.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No students found in this class.
                </div>
            )}
        </div>
    );
}