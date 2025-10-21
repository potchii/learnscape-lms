// src/app/parent/dashboard/page.tsx - Updated version
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { StudentOverview } from "@/components/parent/dashboard/StudentOverview";
import { IncompleteTasksAlerts } from "@/components/parent/dashboard/IncompleteTasksAlerts";
import { RecentAnnouncements } from "@/components/parent/dashboard/RecentAnnouncements";
import { AttendanceSummary } from "@/components/parent/dashboard/AttendanceSummary";
import { AlertSystem } from "@/components/parent/dashboard/AlertSystem";

export default async function ParentDashboardPage() {
    const session = await requireSession(["PARENT", "ADMIN"]);

    // Get parent with students and their details
    const parent = await prisma.parent.findFirst({
        where: { userId: session.user.id },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            students: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    section: {
                        select: {
                            gradeLevel: true,
                            name: true,
                        },
                    },
                    attendance: {
                        take: 10,
                        orderBy: {
                            date: 'desc',
                        },
                        include: {
                            class: {
                                select: {
                                    subjectName: true,
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

    // Get assignments for all students
    const studentIds = parent.students.map(student => student.id);

    const assignments = await prisma.assignment.findMany({
        where: {
            class: {
                section: {
                    students: {
                        some: {
                            id: {
                                in: studentIds,
                            },
                        },
                    },
                },
            },
            status: "PUBLISHED",
        },
        include: {
            class: {
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
                    section: {
                        select: {
                            gradeLevel: true,
                            name: true,
                        },
                    },
                },
            },
            submissions: {
                where: {
                    studentId: {
                        in: studentIds,
                    },
                },
            },
        },
        orderBy: {
            dueDate: 'asc',
        },
    });

    // Get recent announcements
    const recentAnnouncements = await prisma.announcement.findMany({
        where: {
            OR: [
                { classId: null }, // School-wide announcements
                {
                    class: {
                        section: {
                            students: {
                                some: {
                                    id: {
                                        in: studentIds,
                                    },
                                },
                            },
                        },
                    },
                },
            ],
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
            class: {
                select: {
                    subjectName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 5,
    });

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {parent.user.firstName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Monitoring {parent.students.length} student{parent.students.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Alert System - NEW */}
            <AlertSystem parentId={parent.id} />

            {/* Student Overview */}
            <div className="mb-8">
                <StudentOverview students={parent.students} assignments={assignments} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <IncompleteTasksAlerts
                        students={parent.students}
                        assignments={assignments}
                    />
                    <AttendanceSummary students={parent.students} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <RecentAnnouncements
                        announcements={recentAnnouncements}
                        students={parent.students}
                    />
                </div>
            </div>
        </div>
    );
}