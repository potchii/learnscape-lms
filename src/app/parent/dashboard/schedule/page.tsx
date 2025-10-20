import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ParentWeeklySchedule } from "./ParentWeeklySchedule";

export default async function ParentSchedulePage() {
    const session = await requireSession(["PARENT", "ADMIN"]);

    // Get parent with their students and class schedules
    const parent = await prisma.parent.findFirst({
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
                    section: {
                        include: {
                            classes: {
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
                                },
                                orderBy: {
                                    subjectName: 'asc',
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!parent) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Parent Record Not Found</h2>
                    <p className="text-red-600">We couldn't find your parent information.</p>
                </div>
            </div>
        );
    }

    // Process schedule data for all students
    const scheduleData = parent.students.flatMap(student =>
        student.section.classes.map((classItem) => {
            // Parse schedule string (format: "Monday 09:00-10:30, Wednesday 09:00-10:30")
            const scheduleSlots = classItem.schedule?.split(', ') || [];

            const timeSlots = scheduleSlots.map(slot => {
                const [day, timeRange] = slot.split(' ');
                const [startTime, endTime] = timeRange?.split('-') || [];

                return {
                    day: day?.toLowerCase(),
                    startTime,
                    endTime,
                    timeRange,
                };
            }).filter(slot => slot.day && slot.startTime && slot.endTime);

            return {
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
            };
        })
    );

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <Link
                        href="/parent/dashboard"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Family Schedule</h1>
                <p className="text-gray-600">
                    Weekly timetable for all your children
                </p>
            </div>

            <ParentWeeklySchedule
                scheduleData={scheduleData}
                students={parent.students}
            />
        </div>
    );
}