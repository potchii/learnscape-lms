// src/app/student/dashboard/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { UpcomingTasks } from "@/components/student/dashboard/UpcomingTasks";
import { RecentActivity } from "@/components/student/dashboard/RecentActivity";

interface DashboardData {
    upcomingTasks: Array<{
        id: string;
        title: string;
        type: 'ASSIGNMENT' | 'QUIZ';
        dueDate: Date;
        subject: string;
        subjectColor: string;
        status: 'PENDING' | 'SUBMITTED' | 'OVERDUE';
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    recentActivity: Array<{
        id: string;
        type: 'ANNOUNCEMENT' | 'MATERIAL' | 'GRADE' | 'SUBMISSION';
        title: string;
        description: string;
        subject: string;
        timestamp: Date;
        link: string;
    }>;
    stats: {
        totalPending: number;
        overdueCount: number;
        averageGrade: number;
        completedThisWeek: number;
    };
}

export default async function StudentDashboardPage() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
        },
    });

    if (!student) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Student Record Not Found</h2>
                    <p className="text-red-600">We couldn't find your student information.</p>
                </div>
            </div>
        );
    }

    // Fetch data for dashboard
    const dashboardData = await getDashboardData(student.id);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of your academic progress and activities</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-semibold">{dashboardData.stats.totalPending}</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">Pending Tasks</h3>
                            <p className="text-sm text-gray-500">To be completed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 font-semibold">{dashboardData.stats.overdueCount}</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">Overdue</h3>
                            <p className="text-sm text-gray-500">Past due date</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{dashboardData.stats.averageGrade}%</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">Average Grade</h3>
                            <p className="text-sm text-gray-500">Current standing</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-semibold">{dashboardData.stats.completedThisWeek}</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">Completed</h3>
                            <p className="text-sm text-gray-500">This week</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Tasks */}
                <UpcomingTasks tasks={dashboardData.upcomingTasks} />

                {/* Recent Activity */}
                <RecentActivity activities={dashboardData.recentActivity} />
            </div>
        </div>
    );
}

async function getDashboardData(studentId: string): Promise<DashboardData> {
    // Get upcoming assignments
    const assignments = await prisma.assignment.findMany({
        where: {
            class: {
                section: {
                    students: {
                        some: { id: studentId }
                    }
                }
            },
            status: "PUBLISHED",
            dueDate: {
                gte: new Date(),
            },
        },
        include: {
            class: {
                select: {
                    subjectName: true,
                },
            },
            submissions: {
                where: {
                    studentId: studentId,
                },
            },
        },
        orderBy: {
            dueDate: 'asc',
        },
        take: 10,
    });

    // Format upcoming tasks
    const upcomingTasks = assignments.map(assignment => {
        const submission = assignment.submissions[0];
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let status: 'PENDING' | 'SUBMITTED' | 'OVERDUE' = 'PENDING';
        if (submission && submission.status !== 'NOT_SUBMITTED') {
            status = 'SUBMITTED';
        } else if (dueDate < now) {
            status = 'OVERDUE';
        }

        let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
        if (daysUntilDue <= 1) priority = 'HIGH';
        else if (daysUntilDue <= 3) priority = 'MEDIUM';

        return {
            id: assignment.id,
            title: assignment.title,
            type: 'ASSIGNMENT' as const,
            dueDate: assignment.dueDate,
            subject: assignment.class.subjectName,
            subjectColor: getClassColor(assignment.class.subjectName),
            status,
            priority,
        };
    });

    // Get recent activity (announcements, materials, grades)
    const recentAnnouncements = await prisma.announcement.findMany({
        where: {
            OR: [
                { classId: null },
                {
                    class: {
                        section: {
                            students: {
                                some: { id: studentId }
                            }
                        }
                    }
                }
            ]
        },
        include: {
            class: {
                select: {
                    subjectName: true,
                },
            },
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
            createdAt: 'desc',
        },
        take: 5,
    });

    const recentMaterials = await prisma.learningMaterial.findMany({
        where: {
            class: {
                section: {
                    students: {
                        some: { id: studentId }
                    }
                }
            }
        },
        include: {
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

    // Format recent activity
    const recentActivity = [
        ...recentAnnouncements.map(announcement => ({
            id: announcement.id,
            type: 'ANNOUNCEMENT' as const,
            title: announcement.title,
            description: `New announcement in ${announcement.class?.subjectName || 'General'}`,
            subject: announcement.class?.subjectName || 'General',
            timestamp: announcement.createdAt,
            link: `/student/subjects/${announcement.classId || 'general'}`,
        })),
        ...recentMaterials.map(material => ({
            id: material.id,
            type: 'MATERIAL' as const,
            title: material.title,
            description: `New material uploaded in ${material.class?.subjectName}`,
            subject: material.class?.subjectName || 'Unknown',
            timestamp: material.createdAt,
            link: `/student/subjects/${material.classId}`,
        })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);

    // Calculate stats
    const totalPending = upcomingTasks.filter(task => task.status === 'PENDING').length;
    const overdueCount = upcomingTasks.filter(task => task.status === 'OVERDUE').length;

    // Mock data for demo - in real app, calculate from actual grades
    const averageGrade = 85;
    const completedThisWeek = 3;

    return {
        upcomingTasks,
        recentActivity,
        stats: {
            totalPending,
            overdueCount,
            averageGrade,
            completedThisWeek,
        },
    };
}

// Reuse helper functions from home page
function getClassColor(subjectName: string): string {
    const colorMap: { [key: string]: string } = {
        mathematics: 'blue',
        math: 'blue',
        science: 'green',
        english: 'purple',
        reading: 'purple',
        writing: 'purple',
        history: 'orange',
        social: 'orange',
        geography: 'red',
        art: 'pink',
        music: 'indigo',
        'physical education': 'teal',
        pe: 'teal',
        sports: 'teal',
    };
    const normalizedName = subjectName.toLowerCase();
    return colorMap[normalizedName] || 'gray';
}