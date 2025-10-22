// src/app/teacher/classes/[classId]/attendance/TakeAttendanceForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface Props {
    classId: string;
    teacherId: string;
    students: Student[];
    existingDates: Date[];
}

export default function TakeAttendanceForm({ classId, teacherId, students, existingDates }: Props) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        // Default to today's date
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [existingAttendance, setExistingAttendance] = useState<any[]>([]);

    // Load attendance for the selected date
    useEffect(() => {
        const loadAttendanceForDate = async () => {
            if (!selectedDate) return;

            setIsLoading(true);
            try {
                const response = await fetch(`/api/attendance?classId=${classId}&date=${selectedDate}`);
                if (response.ok) {
                    const data = await response.json();
                    setExistingAttendance(data.attendance || []);

                    // Initialize attendance state with existing records
                    const initialAttendance: Record<string, string> = {};
                    data.attendance?.forEach((record: any) => {
                        initialAttendance[record.studentId] = record.status;
                    });
                    setAttendance(initialAttendance);
                } else {
                    setExistingAttendance([]);
                    setAttendance({});
                }
            } catch (error) {
                console.error('Error loading attendance:', error);
                setExistingAttendance([]);
                setAttendance({});
            } finally {
                setIsLoading(false);
            }
        };

        loadAttendanceForDate();
    }, [selectedDate, classId]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classId,
                    teacherId,
                    date: selectedDate,
                    attendance: Object.entries(attendance).map(([studentId, status]) => ({
                        studentId,
                        status,
                    })),
                }),
            });

            if (response.ok) {
                router.refresh();
                alert(`Attendance saved successfully for ${new Date(selectedDate).toLocaleDateString()}!`);
            } else {
                throw new Error('Failed to save attendance');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Error saving attendance. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT': return 'bg-green-100 text-green-800 border-green-300';
            case 'ABSENT': return 'bg-red-100 text-red-800 border-red-300';
            case 'LATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'EXCUSED': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusCount = (status: string) => {
        return Object.values(attendance).filter(s => s === status).length;
    };

    const navigateDate = (days: number) => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + days);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    const hasAttendanceForDate = existingDates.some(
        date => new Date(date).toDateString() === new Date(selectedDate).toDateString()
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Date Selection Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Take Attendance</h2>
                        </div>

                        {/* Date Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => navigateDate(-1)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => navigateDate(1)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Date Status */}
                    <div className="flex items-center gap-3">
                        {hasAttendanceForDate && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Saved
                            </span>
                        )}
                        <span className="text-sm text-gray-600">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Attendance Summary */}
                <div className="flex flex-wrap gap-4 text-sm mt-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Present: {getStatusCount('PRESENT')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Absent: {getStatusCount('ABSENT')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Late: {getStatusCount('LATE')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Excused: {getStatusCount('EXCUSED')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span>Not Marked: {students.length - Object.keys(attendance).length}</span>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading attendance data...</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto max-h-96">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
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
                                            {attendance[student.id] && (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(attendance[student.id])}`}>
                                                    {attendance[student.id]}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                                    className={`px-3 py-1 text-xs rounded transition-colors ${attendance[student.id] === 'PRESENT'
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                >
                                                    Present
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                                    className={`px-3 py-1 text-xs rounded transition-colors ${attendance[student.id] === 'ABSENT'
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                >
                                                    Absent
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusChange(student.id, 'LATE')}
                                                    className={`px-3 py-1 text-xs rounded transition-colors ${attendance[student.id] === 'LATE'
                                                            ? 'bg-yellow-600 text-white'
                                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                        }`}
                                                >
                                                    Late
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusChange(student.id, 'EXCUSED')}
                                                    className={`px-3 py-1 text-xs rounded transition-colors ${attendance[student.id] === 'EXCUSED'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        }`}
                                                >
                                                    Excused
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {Object.keys(attendance).length > 0 ? (
                                    `${Object.keys(attendance).length} of ${students.length} students marked`
                                ) : (
                                    'No attendance marked yet'
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Clear all attendance for this date
                                        setAttendance({});
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Clear All
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || Object.keys(attendance).length === 0}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}