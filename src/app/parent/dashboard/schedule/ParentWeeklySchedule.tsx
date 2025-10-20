"use client";

import { useState } from "react";
import { Student } from "@prisma/client";

interface ScheduleItem {
    id: string;
    subject: string;
    teacher: string;
    student: {
        id: string;
        name: string;
        gradeLevel: number;
        sectionName: string;
    };
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
        timeRange: string;
    }>;
    schedule: string | null;
}

interface ParentWeeklyScheduleProps {
    scheduleData: ScheduleItem[];
    students: Student[];
}

// Color palette for different students
const studentColors = [
    { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800' },
    { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800' },
    { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800' },
    { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800' },
    { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800' },
];

export function ParentWeeklySchedule({ scheduleData, students }: ParentWeeklyScheduleProps) {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [selectedStudent, setSelectedStudent] = useState<string>("all");

    const daysOfWeek = [
        { name: 'Monday', short: 'Mon' },
        { name: 'Tuesday', short: 'Tue' },
        { name: 'Wednesday', short: 'Wed' },
        { name: 'Thursday', short: 'Thu' },
        { name: 'Friday', short: 'Fri' },
    ];

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const getTodayDayName = () => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    };

    const today = getTodayDayName();

    // Get color for student
    const getStudentColor = (studentId: string) => {
        const studentIndex = students.findIndex(s => s.id === studentId);
        return studentColors[studentIndex % studentColors.length];
    };

    // Filter schedule data based on selected student
    const filteredScheduleData = selectedStudent === "all"
        ? scheduleData
        : scheduleData.filter(item => item.student.id === selectedStudent);

    const getClassesForDay = (day: string) => {
        return filteredScheduleData.filter(classItem =>
            classItem.timeSlots.some(slot => slot.day === day.toLowerCase())
        ).map(classItem => {
            const timeSlot = classItem.timeSlots.find(slot => slot.day === day.toLowerCase());
            return {
                ...classItem,
                timeSlot: timeSlot!,
            };
        }).sort((a, b) => a.timeSlot.startTime.localeCompare(b.timeSlot.startTime));
    };

    const getClassPosition = (startTime: string, endTime: string) => {
        const startHour = parseInt(startTime.split(':')[0]);
        const startMinute = parseInt(startTime.split(':')[1]);
        const endHour = parseInt(endTime.split(':')[0]);
        const endMinute = parseInt(endTime.split(':')[1]);

        const startPosition = (startHour - 8) * 60 + startMinute;
        const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

        return {
            top: `${startPosition}px`,
            height: `${duration}px`,
        };
    };

    const getCurrentWeekRange = () => {
        const start = new Date(currentWeek);
        start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday

        const end = new Date(start);
        end.setDate(end.getDate() + 4); // End on Friday (school week)

        return {
            start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };
    };

    const weekRange = getCurrentWeekRange();

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Schedule Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Family Weekly Schedule</h2>
                        <p className="text-sm text-gray-600">
                            Week of {weekRange.start} - {weekRange.end}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Student Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Student
                            </label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="all">All Students</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.user.firstName} {student.user.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Week Navigation */}
                        <div className="flex items-end space-x-2">
                            <button
                                onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setCurrentWeek(new Date())}
                                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Schedule View */}
            <div className="p-6">
                <div className="hidden lg:block">
                    <div className="grid grid-cols-6 gap-4">
                        {/* Time column */}
                        <div className="pt-12">
                            {timeSlots.map(time => (
                                <div key={time} className="h-16 border-t border-gray-200 text-xs text-gray-500 pt-1">
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {daysOfWeek.map(day => {
                            const dayClasses = getClassesForDay(day.name);
                            const isToday = today === day.name.toLowerCase();

                            return (
                                <div key={day.name} className="relative">
                                    <div className={`text-center py-3 font-semibold ${isToday ? 'bg-blue-100 text-blue-800 rounded-t-lg' : 'text-gray-700'
                                        }`}>
                                        {day.short}
                                        {isToday && <div className="text-xs font-normal">Today</div>}
                                    </div>

                                    <div className="relative min-h-[640px] border border-gray-200 rounded-b-lg">
                                        {dayClasses.map(classItem => {
                                            const position = getClassPosition(
                                                classItem.timeSlot.startTime,
                                                classItem.timeSlot.endTime
                                            );
                                            const studentColor = getStudentColor(classItem.student.id);

                                            return (
                                                <div
                                                    key={`${classItem.id}-${day.name}`}
                                                    className={`absolute left-1 right-1 ${studentColor.bg} ${studentColor.border} border rounded-lg p-2 overflow-hidden hover:opacity-80 transition-opacity`}
                                                    style={{
                                                        top: position.top,
                                                        height: position.height,
                                                    }}
                                                >
                                                    <div className="text-xs font-semibold truncate">
                                                        {classItem.subject}
                                                    </div>
                                                    <div className="text-xs truncate">
                                                        {classItem.teacher}
                                                    </div>
                                                    <div className="text-xs mt-1">
                                                        {classItem.timeSlot.timeRange}
                                                    </div>
                                                    <div className="text-xs font-medium mt-1">
                                                        {classItem.student.name}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Time grid lines */}
                                        {timeSlots.map((time, index) => (
                                            <div
                                                key={time}
                                                className="absolute left-0 right-0 border-t border-gray-100"
                                                style={{ top: `${index * 64}px` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Schedule View */}
                <div className="lg:hidden space-y-4">
                    {daysOfWeek.map(day => {
                        const dayClasses = getClassesForDay(day.name);
                        const isToday = today === day.name.toLowerCase();

                        return (
                            <div key={day.name} className="border border-gray-200 rounded-lg">
                                <div className={`px-4 py-3 font-semibold ${isToday ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-700'
                                    }`}>
                                    {day.name}
                                    {isToday && <span className="ml-2 text-sm font-normal">(Today)</span>}
                                </div>

                                <div className="p-4">
                                    {dayClasses.length > 0 ? (
                                        <div className="space-y-3">
                                            {dayClasses.map(classItem => {
                                                const studentColor = getStudentColor(classItem.student.id);

                                                return (
                                                    <div
                                                        key={`${classItem.id}-${day.name}`}
                                                        className={`border-l-4 ${studentColor.border} ${studentColor.bg} rounded-r-lg p-3`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="font-semibold">
                                                                    {classItem.subject}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {classItem.teacher}
                                                                </p>
                                                            </div>
                                                            <div className="text-sm font-medium text-right">
                                                                {classItem.timeSlot.timeRange}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="font-medium">
                                                                {classItem.student.name}
                                                            </span>
                                                            <span className="text-gray-500">
                                                                Grade {classItem.student.gradeLevel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-500">
                                            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            No classes scheduled
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Student Legend */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Student Legend</h3>
                    <div className="flex flex-wrap gap-4">
                        {students.map((student, index) => {
                            const color = studentColors[index % studentColors.length];
                            return (
                                <div key={student.id} className="flex items-center">
                                    <div className={`w-4 h-4 ${color.bg} ${color.border} border rounded mr-2`}></div>
                                    <span className="text-sm text-gray-700">
                                        {student.user.firstName} {student.user.lastName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}