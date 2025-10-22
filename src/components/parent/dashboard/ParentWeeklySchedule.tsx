'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, User, BookOpen } from "lucide-react";

interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}

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

export function ParentWeeklySchedule({ scheduleData, students }: ParentWeeklyScheduleProps) {
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const getStudentColor = (studentId: string) => {
        const studentIndex = students.findIndex(s => s.id === studentId);
        const colors = [
            'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
            'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
            'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
            'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
            'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
            'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
            'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
        ];
        return colors[studentIndex % colors.length] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getClassesForDayAndTime = (day: string, timeSlot: string) => {
        return scheduleData.filter(item =>
            item.timeSlots.some(slot =>
                slot.day === day &&
                slot.startTime <= timeSlot &&
                slot.endTime > timeSlot
            )
        );
    };

    const getClassPosition = (startTime: string, endTime: string) => {
        const startHour = parseInt(startTime.split(':')[0]);
        const startMinute = parseInt(startTime.split(':')[1]);
        const endHour = parseInt(endTime.split(':')[0]);
        const endMinute = parseInt(endTime.split(':')[1]);

        const startPosition = (startHour - 7) * 60 + startMinute;
        const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

        return {
            top: `${startPosition}px`,
            height: `${duration}px`,
        };
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeek);
        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() + 7);
        }
        setCurrentWeek(newDate);
    };

    const getCurrentWeekRange = () => {
        const start = new Date(currentWeek);
        const end = new Date(currentWeek);

        // Set to Monday of the current week
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        // Set to Sunday of the current week
        end.setDate(start.getDate() + 6);

        return {
            start: start.toLocaleDateString(),
            end: end.toLocaleDateString(),
        };
    };

    const weekRange = getCurrentWeekRange();

    // Simplified function to check if we should render a class at this time slot
    const shouldRenderClass = (classItem: ScheduleItem, day: string, gridTime: string) => {
        const timeSlot = classItem.timeSlots.find(slot => slot.day === day);
        if (!timeSlot) return false;

        // Only render if this grid time matches the class start time
        return timeSlot.startTime === gridTime;
    };

    return (
        <div className="space-y-4">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateWeek('prev')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900">
                            Week of {weekRange.start} - {weekRange.end}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {scheduleData.length} classes across {students.length} students
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateWeek('next')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Badge variant="secondary">
                    {students.length} {students.length === 1 ? 'Student' : 'Students'}
                </Badge>
            </div>

            {/* Schedule Grid */}
            <div className="border rounded-lg bg-white overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-8 border-b bg-gray-50">
                    <div className="p-3 border-r font-medium text-gray-900">Time</div>
                    {daysOfWeek.map(day => (
                        <div key={day} className="p-3 text-center font-medium text-gray-900">
                            {day.substring(0, 3)}
                        </div>
                    ))}
                </div>

                {/* Time Slots */}
                <div className="relative">
                    {timeSlots.map((gridTime) => (
                        <div key={gridTime} className="grid grid-cols-8 border-b last:border-b-0">
                            {/* Time Label */}
                            <div className="p-2 border-r text-sm text-gray-600 bg-gray-50 flex items-center justify-center">
                                {gridTime}
                            </div>

                            {/* Day Columns */}
                            {daysOfWeek.map(day => {
                                const classes = getClassesForDayAndTime(day, gridTime);

                                return (
                                    <div
                                        key={`${day}-${gridTime}`}
                                        className="p-1 border-r last:border-r-0 min-h-[60px] relative"
                                    >
                                        {classes.map((classItem) => {
                                            // Only render if this is the start time of the class
                                            if (!shouldRenderClass(classItem, day, gridTime)) {
                                                return null;
                                            }

                                            const timeSlot = classItem.timeSlots.find(slot => slot.day === day);
                                            if (!timeSlot) return null;

                                            return (
                                                <div
                                                    key={`${classItem.id}-${day}`}
                                                    className={`absolute left-1 right-1 rounded border p-2 text-xs cursor-pointer ${getStudentColor(classItem.student.id)}`}
                                                    style={getClassPosition(timeSlot.startTime, timeSlot.endTime)}
                                                    title={`${classItem.subject} with ${classItem.teacher} - ${classItem.student.name}`}
                                                >
                                                    <div className="font-medium truncate">
                                                        {classItem.subject}
                                                    </div>
                                                    <div className="truncate text-[10px] opacity-75">
                                                        {classItem.teacher}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <User className="h-2 w-2" />
                                                        <span className="text-[10px]">{classItem.student.name.split(' ')[0]}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-2 w-2" />
                                                        <span className="text-[10px]">{timeSlot.timeRange}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile View and Schedule Summary remain the same */}
            {/* ... rest of the component remains unchanged ... */}
        </div>
    );
}