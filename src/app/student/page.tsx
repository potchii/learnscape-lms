// src/app/student/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface ClassWithProgress {
    id: string;
    subjectName: string;
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    recentActivity: Date | null;
    color: string;
}

export default async function StudentHomePage() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    // Get student with their classes
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
                            Assignment: {
                                where: {
                                    status: "PUBLISHED",
                                },
                            },
                            learningMaterials: {
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                take: 1,
                            },
                            announcements: {
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                take: 1,
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

    // Process classes with progress data
    const classes: ClassWithProgress[] = await Promise.all(
        student.section.classes.map(async (classItem) => {
            // Get assignments for this class
            const assignments = await prisma.assignment.findMany({
                where: {
                    classId: classItem.id,
                    status: "PUBLISHED",
                },
                include: {
                    submissions: {
                        where: {
                            studentId: student.id,
                        },
                    },
                },
            });

            const totalAssignments = assignments.length;
            const submittedAssignments = assignments.filter(assignment => {
                const submission = assignment.submissions.find(sub => sub.studentId === student.id);
                return submission && submission.status !== 'NOT_SUBMITTED';
            }).length;

            const progress = totalAssignments > 0 ? (submittedAssignments / totalAssignments) * 100 : 0;

            // Get most recent activity
            const recentMaterial = classItem.learningMaterials[0]?.createdAt;
            const recentAnnouncement = classItem.announcements[0]?.createdAt;
            const recentActivity = recentMaterial && recentAnnouncement
                ? new Date(Math.max(recentMaterial.getTime(), recentAnnouncement.getTime()))
                : recentMaterial || recentAnnouncement;

            return {
                id: classItem.id,
                subjectName: classItem.subjectName,
                teacher: classItem.teacher,
                progress,
                totalAssignments,
                submittedAssignments,
                recentActivity,
                color: getClassColor(classItem.subjectName),
            };
        })
    );

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {student.user.firstName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Grade {student.section.gradeLevel} • {student.section.name}
                </p>
            </div>

            {/* Classes Grid */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
                    <span className="text-gray-600">
                        {classes.length} subject{classes.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <Link
                            key={classItem.id}
                            href={`/student/subjects/${classItem.id}`}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white ${getColorClasses(classItem.color)}`}>
                                    <span className="text-lg font-semibold">
                                        {classItem.subjectName.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">{Math.round(classItem.progress)}%</div>
                                    <div className="text-xs text-gray-500">Progress</div>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                {classItem.subjectName}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4">
                                {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                <div
                                    className={`h-2 rounded-full ${getProgressColor(classItem.progress)}`}
                                    style={{ width: `${classItem.progress}%` }}
                                ></div>
                            </div>

                            {/* Stats */}
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>{classItem.submittedAssignments}/{classItem.totalAssignments} assignments</span>
                                {classItem.recentActivity && (
                                    <span>Updated {formatTimeAgo(classItem.recentActivity)}</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{classes.length}</div>
                    <div className="text-sm text-gray-600">Total Subjects</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {classes.reduce((total, cls) => total + cls.totalAssignments, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Assignments</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {classes.reduce((total, cls) => total + cls.submittedAssignments, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Submitted</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                        {Math.round(classes.reduce((acc, cls) => acc + cls.progress, 0) / classes.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Average Progress</div>
                </div>
            </div>
        </div>
    );
}

// Helper functions
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

function getColorClasses(color: string): string {
    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        pink: 'bg-pink-500',
        indigo: 'bg-indigo-500',
        teal: 'bg-teal-500',
        gray: 'bg-gray-500',
    };
    return colorClasses[color] || 'bg-gray-500';
}

function getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}