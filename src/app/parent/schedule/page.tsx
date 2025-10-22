import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParentWeeklySchedule } from "@/components/parent/dashboard/ParentWeeklySchedule";
import { Calendar, Clock, Users, BookOpen, School } from "lucide-react";

interface StudentWithClasses {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
    classes: Array<{
        id: string;
        subjectName: string;
        schedule: string | null;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    }>;
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

// Helper function to parse different schedule formats
const parseSchedule = (schedule: string): Array<{ day: string; startTime: string; endTime: string; timeRange: string }> => {
    const timeSlots: Array<{ day: string; startTime: string; endTime: string; timeRange: string }> = [];

    try {
        // Format 1: "Monday 08:00-09:00, Wednesday 10:00-11:00"
        if (schedule.includes(', ')) {
            const slots = schedule.split(', ');
            slots.forEach(slot => {
                const [day, timeRange] = slot.split(' ');
                const [startTime, endTime] = timeRange.split('-');

                timeSlots.push({
                    day: day.trim(),
                    startTime: startTime.trim(),
                    endTime: endTime.trim(),
                    timeRange: timeRange.trim(),
                });
            });
        }
        // Format 2: "Mon-Fri 9:00 AM to 11:00 AM"
        else if (schedule.includes(' to ') && schedule.includes('-')) {
            const [daysPart, timePart] = schedule.split(' ');
            const [startDay, endDay] = daysPart.split('-');

            // Parse time range
            const timeMatch = schedule.match(/(\d+:\d+ [AP]M) to (\d+:\d+ [AP]M)/);
            if (timeMatch) {
                const [, startTime12, endTime12] = timeMatch;

                // Convert 12-hour to 24-hour format
                const convertTo24Hour = (time12: string): string => {
                    const [time, period] = time12.split(' ');
                    let [hours, minutes] = time.split(':').map(Number);

                    if (period === 'PM' && hours !== 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;

                    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                };

                const startTime = convertTo24Hour(startTime12);
                const endTime = convertTo24Hour(endTime12);

                // Map day abbreviations to full names
                const dayMap: Record<string, string> = {
                    'Mon': 'Monday',
                    'Tue': 'Tuesday',
                    'Wed': 'Wednesday',
                    'Thu': 'Thursday',
                    'Fri': 'Friday',
                    'Sat': 'Saturday',
                    'Sun': 'Sunday'
                };

                const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const startIndex = dayOrder.indexOf(dayMap[startDay] || startDay);
                const endIndex = dayOrder.indexOf(dayMap[endDay] || endDay);

                if (startIndex !== -1 && endIndex !== -1) {
                    for (let i = startIndex; i <= endIndex; i++) {
                        timeSlots.push({
                            day: dayOrder[i],
                            startTime,
                            endTime,
                            timeRange: `${startTime12} to ${endTime12}`,
                        });
                    }
                }
            }
        }
        // Format 3: Single day with time range
        else if (schedule.includes('-')) {
            const parts = schedule.split(' ');
            if (parts.length >= 2) {
                const day = parts[0];
                const timeRange = parts[1];
                const [startTime, endTime] = timeRange.split('-');

                timeSlots.push({
                    day: day.trim(),
                    startTime: startTime.trim(),
                    endTime: endTime.trim(),
                    timeRange: timeRange.trim(),
                });
            }
        }
        // Default: Treat as single time slot for Monday (fallback)
        else {
            timeSlots.push({
                day: 'Monday',
                startTime: '08:00',
                endTime: '09:00',
                timeRange: '08:00-09:00',
            });
        }
    } catch (error) {
        console.warn('Error parsing schedule format:', schedule, error);
        // Fallback: Create a default time slot
        timeSlots.push({
            day: 'Monday',
            startTime: '08:00',
            endTime: '09:00',
            timeRange: '08:00-09:00',
        });
    }

    return timeSlots;
};

export default async function ParentSchedulePage() {
    const session = await requireSession(['PARENT']);

    const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
        include: {
            students: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    section: true,
                },
            },
        },
    });

    if (!parent) {
        return <div>Parent not found</div>;
    }

    // Get classes for all student sections
    const sectionIds = parent.students.map(student => student.sectionId);
    const classes = await prisma.class.findMany({
        where: {
            sectionId: {
                in: sectionIds,
            },
        },
        include: {
            teacher: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
            section: true,
        },
    });

    // Map classes to students to create StudentWithClasses array
    const studentsWithClasses: StudentWithClasses[] = parent.students.map(student => ({
        ...student,
        classes: classes.filter(classItem => classItem.sectionId === student.sectionId),
    }));

    const students: StudentWithClasses[] = studentsWithClasses;

    // Parse schedule data for the weekly schedule component
    const parseScheduleData = (): ScheduleItem[] => {
        const scheduleData: ScheduleItem[] = [];

        students.forEach(student => {
            student.classes.forEach(classItem => {
                if (!classItem.schedule) return;

                try {
                    // Use the improved parseSchedule function
                    const timeSlots = parseSchedule(classItem.schedule);

                    scheduleData.push({
                        id: classItem.id,
                        subject: classItem.subjectName,
                        teacher: `${classItem.teacher.user.firstName} ${classItem.teacher.user.lastName}`,
                        student: {
                            id: student.id,
                            name: `${student.user.firstName} ${student.user.lastName}`,
                            gradeLevel: student.section.gradeLevel,
                            sectionName: student.section.name,
                        },
                        timeSlots,
                        schedule: classItem.schedule,
                    });
                } catch (error) {
                    console.warn('Error parsing schedule:', classItem.schedule, error);
                    // Create a fallback schedule item even if parsing fails
                    scheduleData.push({
                        id: classItem.id,
                        subject: classItem.subjectName,
                        teacher: `${classItem.teacher.user.firstName} ${classItem.teacher.user.lastName}`,
                        student: {
                            id: student.id,
                            name: `${student.user.firstName} ${student.user.lastName}`,
                            gradeLevel: student.section.gradeLevel,
                            sectionName: student.section.name,
                        },
                        timeSlots: [{
                            day: 'Monday',
                            startTime: '08:00',
                            endTime: '09:00',
                            timeRange: '08:00-09:00',
                        }],
                        schedule: classItem.schedule,
                    });
                }
            });
        });

        return scheduleData;
    };

    const scheduleData = parseScheduleData();

    // Get upcoming events (simulated - in real app, this would come from a calendar/events table)
    const upcomingEvents = [
        {
            id: '1',
            title: 'Parent-Teacher Conference',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            type: 'MEETING' as const,
            students: students.map(s => s.id),
        },
        {
            id: '2',
            title: 'Science Fair',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            type: 'EVENT' as const,
            students: students.map(s => s.id),
        },
        {
            id: '3',
            title: 'End of Quarter Exams',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            type: 'EXAM' as const,
            students: students.map(s => s.id),
        },
    ];

    // Calculate schedule statistics
    const getScheduleStats = () => {
        const totalClasses = scheduleData.length;
        const uniqueSubjects = new Set(scheduleData.map(item => item.subject)).size;
        const totalHours = scheduleData.reduce((total, item) => {
            return total + item.timeSlots.length * 1; // Assuming 1 hour per slot
        }, 0);

        return {
            totalClasses,
            uniqueSubjects,
            totalHours,
            totalStudents: students.length,
        };
    };

    const stats = getScheduleStats();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
                    <p className="text-gray-600 mt-2">
                        Consolidated timetable and school calendar for all your children
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Stats and Events */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">Students</span>
                                    </div>
                                    <span className="font-semibold">{stats.totalStudents}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Classes</span>
                                    </div>
                                    <span className="font-semibold">{stats.totalClasses}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <School className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm">Subjects</span>
                                    </div>
                                    <span className="font-semibold">{stats.uniqueSubjects}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm">Hours/Week</span>
                                    </div>
                                    <span className="font-semibold">{stats.totalHours}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Events */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Upcoming Events
                                </CardTitle>
                                <CardDescription>
                                    School events and important dates
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-sm text-gray-900">
                                                    {event.title}
                                                </h4>
                                                <Badge
                                                    variant={
                                                        event.type === 'MEETING' ? 'default' :
                                                            event.type === 'EXAM' ? 'destructive' : 'secondary'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {event.type}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-gray-600 space-y-1">
                                                <p>
                                                    {event.date.toLocaleDateString()} at{' '}
                                                    {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p>
                                                    In {Math.ceil((event.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {upcomingEvents.length === 0 && (
                                    <div className="text-center py-4 text-gray-500">
                                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">No upcoming events</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Student List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>My Students</CardTitle>
                                <CardDescription>
                                    Quick access to student schedules
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {students.map((student) => {
                                        const studentClasses = scheduleData.filter(
                                            item => item.student.id === student.id
                                        );

                                        return (
                                            <Link
                                                key={student.id}
                                                href={`/parent/students/${student.id}/schedule`}
                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900 group-hover:text-blue-600">
                                                        {student.user.firstName} {student.user.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Grade {student.section.gradeLevel} - {studentClasses.length} classes
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                    View
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Weekly Schedule */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Weekly Schedule
                                </CardTitle>
                                <CardDescription>
                                    Consolidated timetable for all your children
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ParentWeeklySchedule
                                    scheduleData={scheduleData}
                                    students={students}
                                />
                            </CardContent>
                        </Card>

                        {/* Schedule Legend */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Schedule Legend</CardTitle>
                                <CardDescription>
                                    Color coding for each student
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {students.map((student, index) => {
                                        const colors = [
                                            'bg-blue-100 text-blue-800 border-blue-200',
                                            'bg-green-100 text-green-800 border-green-200',
                                            'bg-purple-100 text-purple-800 border-purple-200',
                                            'bg-orange-100 text-orange-800 border-orange-200',
                                            'bg-pink-100 text-pink-800 border-pink-200',
                                        ];
                                        const colorClass = colors[index % colors.length];

                                        return (
                                            <div key={student.id} className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${colorClass.split(' ')[0]}`} />
                                                <span className="text-sm text-gray-700">
                                                    {student.user.firstName} {student.user.lastName}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}