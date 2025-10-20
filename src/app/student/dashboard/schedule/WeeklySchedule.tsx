"use client";

import { useState } from "react";

interface ScheduleItem {
    id: string;
    subject: string;
    teacher: string;
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
        timeRange: string;
    }>;
    schedule: string | null;
}

interface WeeklyScheduleProps {
    scheduleData: ScheduleItem[];
}

export function WeeklySchedule({ scheduleData }: WeeklyScheduleProps) {
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const daysOfWeek = [
        { name: 'Monday', short: 'Mon' },
        { name: 'Tuesday', short: 'Tue' },
        { name: 'Wednesday', short: 'Wed' },
        { name: 'Thursday', short: 'Thu' },
        { name: 'Friday', short: 'Fri' },
        { name: 'Saturday', short: 'Sat' },
        { name: 'Sunday', short: 'Sun' },
    ];

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const getTodayDayName = () => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    };

    const today = getTodayDayName();

    const getClassesForDay = (day: string) => {
        return scheduleData.filter(classItem =>
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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Class Schedule</h2>
                        <p className="text-sm text-gray-600">
                            Week of {weekRange.start} - {weekRange.end}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
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
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                        {daysOfWeek.slice(0, 5).map(day => {
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

                                            return (
                                                <div
                                                    key={`${classItem.id}-${day.name}`}
                                                    className="absolute left-1 right-1 bg-blue-100 border border-blue-200 rounded-lg p-2 overflow-hidden hover:bg-blue-200 transition-colors"
                                                    style={{
                                                        top: position.top,
                                                        height: position.height,
                                                    }}
                                                >
                                                    <div className="text-xs font-semibold text-blue-800 truncate">
                                                        {classItem.subject}
                                                    </div>
                                                    <div className="text-xs text-blue-600 truncate">
                                                        {classItem.teacher}
                                                    </div>
                                                    <div className="text-xs text-blue-500 mt-1">
                                                        {classItem.timeSlot.timeRange}
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
                    {daysOfWeek.slice(0, 5).map(day => {
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
                                            {dayClasses.map(classItem => (
                                                <div
                                                    key={`${classItem.id}-${day.name}`}
                                                    className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-blue-800">
                                                                {classItem.subject}
                                                            </h3>
                                                            <p className="text-sm text-blue-600">
                                                                {classItem.teacher}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm text-blue-500 font-medium">
                                                            {classItem.timeSlot.timeRange}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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

                {/* Legend */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Schedule Legend</h3>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-2"></div>
                            <span className="text-gray-600">Scheduled Class</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-100 border-2 border-blue-400 rounded mr-2"></div>
                            <span className="text-gray-600">Today's Classes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}