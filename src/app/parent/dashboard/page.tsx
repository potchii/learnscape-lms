import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { StudentOverview } from "@/components/parent/dashboard/StudentOverview";
import { AlertSystem } from "@/components/parent/dashboard/AlertSystem";
import { AttendanceSummary } from "@/components/parent/dashboard/AttendanceSummary";
import { UpcomingDeadlines } from "@/components/parent/dashboard/UpcomingDeadlines";
import { RecentAnnouncements } from "@/components/parent/dashboard/RecentAnnouncements";

interface DashboardData {
    students: Array<{
        id: string;
        studentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
        section: {
            gradeLevel: number;
            name: string;
        };
        attendance: Array<{
            date: Date;
            status: string;
        }>;
        grades: Array<{
            score: number;
            class: {
                subjectName: string;
            };
        }>;
    }>;
    assignments: Array<{
        id: string;
        title: string;
        description?: string | null; // Make description optional here too
        dueDate: Date;
        maxScore: number | null;
        status: string;
        class: {
            subjectName: string;
            teacher: {
                user: {
                    firstName: string;
                    lastName: string;
                };
            };
            section: {
                gradeLevel: number;
                name: string;
            };
        };
        submissions: Array<{
            studentId: string;
            status: string;
            submittedAt: Date | null;
        }>;
    }>;
    announcements: Array<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        class: {
            subjectName: string;
            section: {
                gradeLevel: number;
                name: string;
            };
        } | null;
    }>;
    alerts: Array<{
        id: string;
        message: string;
        viewed: boolean;
        createdAt: Date;
    }>;
}

export default async function ParentDashboardPage() {
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
                            email: true,
                        },
                    },
                    section: true,
                    attendance: {
                        take: 30, // Last 30 days
                        orderBy: { date: 'desc' },
                    },
                    grades: {
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
            alerts: {
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
        },
    });

    if (!parent) {
        return <div>Parent not found</div>;
    }

    // Get assignments for all students
    const studentIds = parent.students.map(student => student.id);

    const assignments = await prisma.assignment.findMany({
        where: {
            class: {
                section: {
                    students: {
                        some: {
                            id: { in: studentIds },
                        },
                    },
                },
            },
            status: 'PUBLISHED',
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
                    section: true,
                },
            },
            submissions: {
                where: {
                    studentId: { in: studentIds },
                },
            },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
    });

    // Get recent announcements
    const announcements = await prisma.announcement.findMany({
        where: {
            OR: [
                { class: null }, // School-wide announcements
                {
                    class: {
                        section: {
                            students: {
                                some: {
                                    id: { in: studentIds },
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
                include: {
                    section: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const dashboardData: DashboardData = {
        students: parent.students,
        assignments,
        announcements,
        alerts: parent.alerts,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Parent Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Overview of your children's academic progress
                    </p>
                </div>

                {/* Alert System */}
                <div className="mb-8">
                    <AlertSystem
                        parentId={parent.id}
                        initialAlerts={dashboardData.alerts}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Student Overview */}
                        <StudentOverview
                            students={dashboardData.students}
                            assignments={dashboardData.assignments}
                        />

                        {/* Upcoming Deadlines */}
                        <UpcomingDeadlines
                            assignments={dashboardData.assignments}
                            students={dashboardData.students}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Attendance Summary */}
                        <AttendanceSummary
                            students={dashboardData.students}
                        />

                        {/* Recent Announcements */}
                        <RecentAnnouncements
                            announcements={dashboardData.announcements}
                            students={dashboardData.students}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}