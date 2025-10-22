import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, BookOpen, User } from "lucide-react";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function StudentSchedulePage({ params }: PageProps) {
    const session = await requireSession(['PARENT']);
    const { id } = params;

    // First get the student to verify ownership
    const student = await prisma.student.findUnique({
        where: {
            id,
            parent: {
                userId: session.user.id,
            },
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            section: true,
        },
    });

    if (!student) {
        notFound();
    }

    // Then get the classes for the student's section
    const classes = await prisma.class.findMany({
        where: {
            sectionId: student.sectionId,
        },
        include: {
            teacher: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            subjectName: 'asc',
        },
    });

    // Group classes by day for easier display
    const classesByDay = classes.reduce((acc, classItem) => {
        if (!classItem.schedule) return acc;

        try {
            const timeSlots = classItem.schedule.split(', ').map(slot => {
                const [day, timeRange] = slot.split(' ');
                return { day: day.trim(), timeRange: timeRange.trim() };
            });

            timeSlots.forEach(({ day, timeRange }) => {
                if (!acc[day]) {
                    acc[day] = [];
                }
                acc[day].push({
                    ...classItem,
                    timeRange,
                });
            });
        } catch (error) {
            console.error('Error parsing schedule:', classItem.schedule);
        }

        return acc;
    }, {} as Record<string, any[]>);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Get unique teachers properly
    const getUniqueTeachers = () => {
        const teacherMap = new Map();

        classes.forEach(classItem => {
            const teacher = classItem.teacher;
            if (!teacherMap.has(teacher.user.id)) {
                teacherMap.set(teacher.user.id, teacher);
            }
        });

        return Array.from(teacherMap.values());
    };

    const uniqueTeachers = getUniqueTeachers();

    const getNextClass = () => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        // Check today's remaining classes first
        const todaysClasses = classesByDay[today] || [];
        const upcomingToday = todaysClasses.filter(classItem => {
            const [startTime] = classItem.timeRange.split('-');
            return startTime > currentTime;
        }).sort((a, b) => a.timeRange.localeCompare(b.timeRange))[0];

        if (upcomingToday) {
            return {
                class: upcomingToday,
                day: today,
                isToday: true,
            };
        }

        // If no more classes today, find the next class in the week
        const todayIndex = daysOfWeek.indexOf(today);
        for (let i = 1; i <= 7; i++) {
            const nextDayIndex = (todayIndex + i) % 7;
            const nextDay = daysOfWeek[nextDayIndex];
            const nextDayClasses = classesByDay[nextDay] || [];

            if (nextDayClasses.length > 0) {
                const firstClass = nextDayClasses.sort((a, b) => a.timeRange.localeCompare(b.timeRange))[0];
                return {
                    class: firstClass,
                    day: nextDay,
                    isToday: false,
                    daysUntil: i,
                };
            }
        }

        return null;
    };

    const nextClass = getNextClass();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <Link href={`/parent/students/${id}`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Student Profile
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Schedule - {student.user.firstName} {student.user.lastName}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Grade {student.section.gradeLevel} - {student.section.name}
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/parent/schedule">
                                View All Schedules
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Summary and Next Class */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Next Class */}
                        {nextClass && (
                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-blue-900">
                                        <Clock className="h-5 w-5" />
                                        Next Class
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-blue-900">
                                                {nextClass.class.subjectName}
                                            </h4>
                                            <p className="text-sm text-blue-700">
                                                {nextClass.class.teacher.user.firstName} {nextClass.class.teacher.user.lastName}
                                            </p>
                                        </div>

                                        <div className="space-y-2 text-sm text-blue-800">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {nextClass.isToday ? 'Today' : nextClass.day}
                                                    {nextClass.daysUntil && ` (in ${nextClass.daysUntil} day${nextClass.daysUntil > 1 ? 's' : ''})`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>{nextClass.class.timeRange}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Schedule Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Classes</span>
                                    <span className="font-semibold">{classes.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Days with Classes</span>
                                    <span className="font-semibold">
                                        {Object.keys(classesByDay).length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Weekly Sessions</span>
                                    <span className="font-semibold">
                                        {Object.values(classesByDay).reduce((total, classes) => total + classes.length, 0)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Teachers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Teachers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {uniqueTeachers.map(teacher => {
                                        const teacherClasses = classes.filter(c => c.teacher.id === teacher.id);

                                        return (
                                            <div
                                                key={teacher.user.id}
                                                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                                            >
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {teacher.user.firstName} {teacher.user.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {teacherClasses.length} subject
                                                        {teacherClasses.length > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
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
                                    {student.user.firstName}'s class timetable
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {daysOfWeek.map(day => {
                                        const dayClasses = classesByDay[day] || [];

                                        return (
                                            <div key={day} className="border rounded-lg">
                                                <div className="bg-gray-50 px-4 py-3 border-b">
                                                    <h3 className="font-semibold text-gray-900">{day}</h3>
                                                </div>

                                                {dayClasses.length > 0 ? (
                                                    <div className="divide-y">
                                                        {dayClasses
                                                            .sort((a, b) => a.timeRange.localeCompare(b.timeRange))
                                                            .map(classItem => (
                                                                <div
                                                                    key={`${classItem.id}-${day}`}
                                                                    className="p-4 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-3 mb-2">
                                                                                <h4 className="font-semibold text-gray-900">
                                                                                    {classItem.subjectName}
                                                                                </h4>
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    {classItem.timeRange}
                                                                                </Badge>
                                                                            </div>

                                                                            <div className="text-sm text-gray-600 space-y-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <User className="h-3 w-3" />
                                                                                    <span>
                                                                                        {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <BookOpen className="h-3 w-3" />
                                                                                    <span>Subject</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <Button variant="outline" size="sm">
                                                                            Details
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500">
                                                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                                        <p>No classes scheduled</p>
                                                    </div>
                                                )}
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