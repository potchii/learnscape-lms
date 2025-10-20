import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ClassProgressGrid } from "@/components/student/dashboard/ClassProgressGrid";
import { UpcomingDeadlines } from "@/components/student/dashboard/UpcomingDeadlines";
import { RecentActivityFeed } from "@/components/student/dashboard/RecentActivityFeed"
import { QuickStats } from "@/components/student/dashboard/QuickStats";

export default async function StudentDashboardPage() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    // Get student with their section
    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
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
                            _count: {
                                select: {
                                    Assignment: {
                                        where: {
                                            status: "PUBLISHED",
                                        },
                                    },
                                    learningMaterials: true,
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

    // Get assignments separately for all classes
    const assignments = await prisma.assignment.findMany({
        where: {
            status: "PUBLISHED",
            class: {
                sectionId: student.sectionId,
            },
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
                    studentId: student.id,
                },
            },
        },
        orderBy: {
            dueDate: 'asc',
        },
    });

    // Get learning materials separately
    const learningMaterials = await prisma.learningMaterial.findMany({
        where: {
            class: {
                sectionId: student.sectionId,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 5,
    });

    // Process classes into class data
    const classes = student.section.classes.map(classItem => {
        const classAssignments = assignments.filter(assignment => assignment.classId === classItem.id);
        const classMaterials = learningMaterials.filter(material => material.classId === classItem.id);

        // Calculate progress for this class
        const totalAssignments = classAssignments.length;
        const submittedAssignments = classAssignments.filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return submission && submission.status !== 'NOT_SUBMITTED';
        }).length;

        const progress = totalAssignments > 0 ? (submittedAssignments / totalAssignments) * 100 : 0;

        // Get upcoming assignments
        const now = new Date();
        const upcomingAssignments = classAssignments
            .filter(assignment => assignment.dueDate > now)
            .slice(0, 3);

        return {
            id: classItem.id,
            name: classItem.subjectName,
            teacher: `${classItem.teacher.user.firstName} ${classItem.teacher.user.lastName}`,
            progress,
            totalAssignments,
            submittedAssignments,
            resourceCount: classMaterials.length,
            upcomingAssignments,
            color: getClassColor(classItem.subjectName),
        };
    });

    // Get all upcoming deadlines across all classes
    const allUpcomingAssignments = assignments
        .filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return assignment.dueDate > new Date() && (!submission || submission.status === 'NOT_SUBMITTED');
        })
        .map(assignment => ({
            ...assignment,
            className: assignment.class.subjectName,
            classColor: getClassColor(assignment.class.subjectName),
        }))
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
        .slice(0, 10);

    // Get recent activity (announcements + new materials)
    const recentAnnouncements = await prisma.announcement.findMany({
        where: {
            OR: [
                { classId: null },
                { class: { sectionId: student.sectionId } }
            ]
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
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {student.user.firstName}!
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Grade {student.section.gradeLevel} • {student.section.name}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Today is</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <QuickStats classes={classes} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                {/* Left Column - Class Progress */}
                <div className="xl:col-span-2">
                    <ClassProgressGrid classes={classes} />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <UpcomingDeadlines assignments={allUpcomingAssignments} />
                    <RecentActivityFeed
                        announcements={recentAnnouncements}
                        studentId={student.id}
                    />
                </div>
            </div>
        </div>
    );
}

// Helper function to assign consistent colors to classes
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