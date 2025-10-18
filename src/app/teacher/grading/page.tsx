"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
        remarks: string;
        gradedAt: string;
    }>;
}

interface ClassItem {
    id: string;
    subjectName: string;
    section: {
        name: string;
        gradeLevel: number;
        students: Student[];
    };
}

const EMOJI_FEEDBACK_OPTIONS = [
    { emoji: "👍", label: "Good work", value: "GOOD_WORK" },
    { emoji: "⭐", label: "Excellent", value: "EXCELLENT" },
    { emoji: "😊", label: "Happy", value: "HAPPY" },
    { emoji: "💪", label: "Strong effort", value: "STRONG_EFFORT" },
    { emoji: "🚀", label: "Great progress", value: "GREAT_PROGRESS" },
    { emoji: "🎯", label: "On target", value: "ON_TARGET" },
    { emoji: "📚", label: "Keep studying", value: "KEEP_STUDYING" },
    { emoji: "🌱", label: "Growing well", value: "GROWING_WELL" },
];

export default function TeacherGradingPage() {
    const router = useRouter();
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [assignmentName, setAssignmentName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch('/api/teacher/grades');
            if (response.ok) {
                const data = await response.json();
                setClasses(data.classes || []);
                if (data.classes?.length > 0) {
                    setSelectedClass(data.classes[0].id);
                }
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitGrade = async (studentId: string, score: string, emojiFeedback: string) => {
        if (!score || !emojiFeedback) {
            alert("Please enter both score and select feedback");
            return;
        }

        setSaving(studentId);

        try {
            const response = await fetch('/api/teacher/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    classId: selectedClass,
                    score: parseFloat(score),
                    emojiFeedback,
                    assignmentName: assignmentName || "General Assignment",
                }),
            });

            if (response.ok) {
                // Refresh the data
                fetchClasses();
            } else {
                const error = await response.json();
                alert(error.error || "Failed to submit grade");
            }
        } catch (error) {
            console.error("Error submitting grade:", error);
            alert("Failed to submit grade");
        } finally {
            setSaving(null);
        }
    };

    const currentClass = classes.find(c => c.id === selectedClass);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading classes...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Simple Grading</h1>
                <p className="text-gray-600">Enter grades with emoji feedback for primary students</p>
            </div>

            {/* Class Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Class
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            {classes.map((classItem) => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.subjectName} - Grade {classItem.section.gradeLevel} ({classItem.section.name})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={assignmentName}
                            onChange={(e) => setAssignmentName(e.target.value)}
                            placeholder="e.g., Math Quiz, Reading Assignment"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {currentClass && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {currentClass.subjectName}
                                </h2>
                                <p className="text-gray-600">
                                    Grade {currentClass.section.gradeLevel} - {currentClass.section.name} Section
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    {currentClass.section.students.length} students
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grading Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score (0-100)
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quick Feedback
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Recent Grades
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentClass.section.students.map((student) => {
                                    const [score, setScore] = useState("");
                                    const [selectedEmoji, setSelectedEmoji] = useState("");

                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            {/* Student Info */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-white">
                                                            {student.user.firstName[0]}{student.user.lastName[0]}
                                                        </span>
                                                    </div>
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

                                            {/* Score Input */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={score}
                                                    onChange={(e) => setScore(e.target.value)}
                                                    placeholder="0-100"
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </td>

                                            {/* Emoji Feedback */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 justify-center">
                                                    {EMOJI_FEEDBACK_OPTIONS.map((emoji) => (
                                                        <button
                                                            key={emoji.value}
                                                            type="button"
                                                            onClick={() => setSelectedEmoji(emoji.value)}
                                                            className={`p-2 rounded-lg text-xl transition-all ${selectedEmoji === emoji.value
                                                                    ? 'bg-blue-100 border-2 border-blue-300 transform scale-110'
                                                                    : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                                                                }`}
                                                            title={emoji.label}
                                                        >
                                                            {emoji.emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                                {selectedEmoji && (
                                                    <p className="text-xs text-center text-gray-600 mt-2">
                                                        {EMOJI_FEEDBACK_OPTIONS.find(e => e.value === selectedEmoji)?.label}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Recent Grades */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {student.grades.slice(0, 3).map((grade) => (
                                                        <div key={grade.id} className="flex justify-between items-center text-sm">
                                                            <span className="font-medium">{grade.score}</span>
                                                            <span className="text-lg" title={grade.remarks}>
                                                                {EMOJI_FEEDBACK_OPTIONS.find(e => e.value === grade.remarks)?.emoji || "📝"}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(grade.gradedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {student.grades.length === 0 && (
                                                        <p className="text-sm text-gray-500 text-center">No grades yet</p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Submit Button */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleSubmitGrade(student.id, score, selectedEmoji)}
                                                    disabled={saving === student.id || !score || !selectedEmoji}
                                                    className={`px-4 py-2 rounded-md font-medium ${saving === student.id
                                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                            : score && selectedEmoji
                                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {saving === student.id ? 'Saving...' : 'Submit'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Bulk Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Use emoji feedback to provide age-appropriate encouragement for primary students
                            </p>
                            <button
                                onClick={() => {
                                    // Clear all inputs
                                    setAssignmentName("");
                                    if (typeof window !== 'undefined') {
                                        window.scrollTo(0, 0);
                                    }
                                }}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {classes.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes assigned</h3>
                    <p className="text-gray-500">You don't have any classes assigned to you yet.</p>
                </div>
            )}

            {/* Help Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Using Emoji Feedback:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {EMOJI_FEEDBACK_OPTIONS.map((emoji) => (
                        <div key={emoji.value} className="flex items-center space-x-2">
                            <span className="text-xl">{emoji.emoji}</span>
                            <span className="text-blue-700">{emoji.label}</span>
                        </div>
                    ))}
                </div>
                <p className="text-blue-700 text-sm mt-3">
                    💡 <strong>Tip:</strong> Emoji feedback helps young students understand their progress in a fun, visual way!
                </p>
            </div>
        </div>
    );
}