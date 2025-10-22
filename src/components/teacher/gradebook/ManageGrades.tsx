// src/app/teacher/gradebook/[classId]/manage/ManageGrades.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        assignmentId: string | null; // Fixed: can be null
        remarks?: string | null;
    }>;
}

interface Assignment {
    id: string;
    title: string;
    dueDate: Date;
    maxScore: number | null;
}

interface Props {
    classId: string;
    students: Student[];
    assignments: Assignment[];
}

export default function ManageGrades({ classId, students, assignments }: Props) {
    const router = useRouter();
    const [selectedAssignment, setSelectedAssignment] = useState<string>(
        assignments[0]?.id || ''
    );
    const [grades, setGrades] = useState<Record<string, number>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGradeChange = (studentId: string, value: string) => {
        const numValue = parseFloat(value);
        setGrades(prev => ({
            ...prev,
            [studentId]: isNaN(numValue) ? 0 : numValue,
        }));
    };

    const handleRemarksChange = (studentId: string, value: string) => {
        setRemarks(prev => ({
            ...prev,
            [studentId]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classId,
                    assignmentId: selectedAssignment,
                    grades: Object.entries(grades).map(([studentId, score]) => ({
                        studentId,
                        score,
                        remarks: remarks[studentId] || '',
                    })),
                }),
            });

            if (response.ok) {
                router.refresh();
                alert('Grades updated successfully!');
            } else {
                throw new Error('Failed to update grades');
            }
        } catch (error) {
            console.error('Error updating grades:', error);
            alert('Error updating grades. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentAssignment = assignments.find(a => a.id === selectedAssignment);

    // Helper function to find existing grade for a student and assignment
    const getExistingGrade = (student: Student, assignmentId: string) => {
        return student.grades.find(
            g => g.assignmentId === assignmentId
        );
    };

    return (
        <div className="space-y-6">
            {/* Assignment Selector */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Assignment
                </label>
                <select
                    value={selectedAssignment}
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                    className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {assignments.map((assignment) => (
                        <option key={assignment.id} value={assignment.id}>
                            {assignment.title} (Due: {new Date(assignment.dueDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {/* Grades Input Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Enter Grades for {currentAssignment?.title}
                    </h3>
                    {currentAssignment?.maxScore && (
                        <p className="text-sm text-gray-600 mt-1">
                            Maximum Score: {currentAssignment.maxScore}
                        </p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Remarks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current Grade
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student) => {
                                const existingGrade = getExistingGrade(student, selectedAssignment);

                                return (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {student.user.firstName} {student.user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {student.studentNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max={currentAssignment?.maxScore || undefined}
                                                defaultValue={existingGrade?.score || ''}
                                                onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.0"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                defaultValue={existingGrade?.remarks || ''}
                                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Optional remarks"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {existingGrade ? `${existingGrade.score}` : 'Not graded'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save All Grades'}
                </button>
            </div>
        </div>
    );
}