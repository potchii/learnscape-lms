// src/app/teacher/classes/[classId]/attendance/AttendanceHistory.tsx
'use client';

import { useState, useEffect } from 'react';

interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface AttendanceRecord {
    id: string;
    date: Date;
    status: string;
    studentId: string;
    student: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
}

interface Props {
    classId: string;
    students: Student[];
    availableDates: Date[];
}

export default function AttendanceHistory({ classId, students, availableDates }: Props) {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'summary'>('summary');

    // Set default date range (last 7 days)
    useEffect(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    }, []);

    const fetchAttendanceData = async () => {
        if (!startDate || !endDate) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/attendance/history?classId=${classId}&startDate=${startDate}&endDate=${endDate}`);
            if (response.ok) {
                const data = await response.json();
                setAttendanceData(data.attendance);
            } else {
                throw new Error('Failed to fetch attendance data');
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            alert('Error fetching attendance data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchAttendanceData();
        }
    }, [startDate, endDate, classId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT': return 'bg-green-100 text-green-800';
            case 'ABSENT': return 'bg-red-100 text-red-800';
            case 'LATE': return 'bg-yellow-100 text-yellow-800';
            case 'EXCUSED': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusCount = (date: Date, status: string) => {
        return attendanceData.filter(a =>
            new Date(a.date).toDateString() === new Date(date).toDateString() &&
            a.status === status
        ).length;
    };

    // Group attendance by date
    const attendanceByDate = attendanceData.reduce((acc, record) => {
        const dateStr = new Date(record.date).toDateString();
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(record);
        return acc;
    }, {} as Record<string, AttendanceRecord[]>);

    // Get unique dates from attendance data
    const uniqueDates = Object.keys(attendanceByDate)
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime());

    // Calculate summary statistics
    const summaryStats = students.map(student => {
        const studentAttendance = attendanceData.filter(a => a.studentId === student.id);
        const presentCount = studentAttendance.filter(a => a.status === 'PRESENT').length;
        const totalCount = studentAttendance.length;
        const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

        return {
            student,
            presentCount,
            totalCount,
            attendanceRate,
        };
    });

    return (
        <div className="space-y-4">
            {/* Date Range Selector */}
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('summary')}
                        className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${viewMode === 'summary'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Summary View
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${viewMode === 'calendar'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Calendar View
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading attendance data...</p>
                </div>
            ) : viewMode === 'summary' ? (
                /* Summary View */
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Student Attendance Summary</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {summaryStats.map((stat) => (
                            <div key={stat.student.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">
                                        {stat.student.user.firstName} {stat.student.user.lastName}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {stat.presentCount}/{stat.totalCount} days
                                    </div>
                                </div>
                                <div className={`text-sm font-medium ${stat.attendanceRate >= 90 ? 'text-green-600' :
                                        stat.attendanceRate >= 80 ? 'text-yellow-600' :
                                            'text-red-600'
                                    }`}>
                                    {stat.totalCount > 0 ? stat.attendanceRate.toFixed(1) + '%' : 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Calendar View */
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Daily Attendance</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uniqueDates.map((date) => (
                            <div key={date.toISOString()} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm text-gray-900">
                                        {date.toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {attendanceByDate[date.toDateString()]?.length || 0} records
                                    </span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusColor('PRESENT')}`}>
                                        P: {getStatusCount(date, 'PRESENT')}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusColor('ABSENT')}`}>
                                        A: {getStatusCount(date, 'ABSENT')}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusColor('LATE')}`}>
                                        L: {getStatusCount(date, 'LATE')}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusColor('EXCUSED')}`}>
                                        E: {getStatusCount(date, 'EXCUSED')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {uniqueDates.length === 0 && (
                            <p className="text-center text-gray-500 py-4 text-sm">
                                No attendance records found for the selected date range.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 border-t border-gray-200">
                <button
                    onClick={fetchAttendanceData}
                    disabled={isLoading || !startDate || !endDate}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    Refresh Data
                </button>
            </div>
        </div>
    );
}