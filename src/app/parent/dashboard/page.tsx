import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { StudentOverview } from "./StudentOverview";
import { IncompleteTasksAlerts } from "./IncompleteTasksAlerts";
import { RecentAnnouncements } from "./RecentAnnouncements";
import { AttendanceSummary } from "./AttendanceSummary";

export default async function ParentDashboardPage() {
    const session = await requireSession(["PARENT", "ADMIN"]);

    // Get parent with their students and related data
    const parent = await prisma.parent.findFirst({
        where: { userId: session.user.id },
        include: {
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
                            },
                        },
                    },
                    attendance: {
                        include: {
                            class: {
                                select: {
                                    subjectName: true,
                                },
                            },
                        },
                        orderBy: {
                            date: 'desc',
                        },
                        take: 10,
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
    const announcements = await prisma.announcement.findMany({
        where: {
            OR: [
                { classId: null }, // School-wide
                {
                    class: {
                        section: {
                            students: {
                                some: {
                                    id: { in: studentIds }
                                }
                            }
                        }
                    }
                }, // Class-specific to student's classes
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
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
                <p className="text-gray-600">
                    Monitoring your children's academic progress
                </p>
            </div>

            {/* Alert Banner */}
            <IncompleteTasksAlerts
                students={parent.students}
                assignments={assignments}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Student Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <StudentOverview
                        students={parent.students}
                        assignments={assignments}
                    />

                    <RecentAnnouncements
                        announcements={announcements}
                        students={parent.students}
                    />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <AttendanceSummary
                        students={parent.students}
                    />

                    {/* Quick Links */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
                        <div className="space-y-3">
                            <Link
                                href="/parent/assignments"
                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">View All Assignments</p>
                                    <p className="text-xs text-gray-500">Track homework and projects</p>
                                </div>
                            </Link>

                            <Link
                                href="/parent/schedule"
                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                            >
                                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Class Schedule</p>
                                    <p className="text-xs text-gray-500">View weekly timetable</p>
                                </div>
                            </Link>

                            <Link
                                href="/parent/announcements"
                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                            >
                                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">All Announcements</p>
                                    <p className="text-xs text-gray-500">School and class updates</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}