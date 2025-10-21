// src/app/student/subjects/[id]/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SubjectHeader } from "@/components/student/dashboard/subjects/SubjectHeader";
import { SubjectNavigation } from "@/components/student/dashboard/subjects/SubjectNavigation";
import { SubjectContent } from "@/components/student/dashboard/subjects/SubjectContent";
import { SubjectParticipants } from "@/components/student/dashboard/subjects/SubjectParticipants";
import { SubjectGrades } from "@/components/student/dashboard/subjects/SubjectGrades";

interface PageProps {
    params: {
        id: string;
    };
    searchParams: {
        tab?: string;
    };
}

export default async function SubjectPage({ params, searchParams }: PageProps) {
    const session = await requireSession(["STUDENT", "ADMIN"]);
    const classId = params.id;
    const currentTab = searchParams.tab || 'content';

    // Get student
    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
        },
    });

    if (!student) {
        notFound();
    }

    // Get class with all related data
    const classData = await prisma.class.findUnique({
        where: {
            id: classId,
            sectionId: student.sectionId,
        },
        include: {
            teacher: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            },
            section: {
                select: {
                    name: true,
                    gradeLevel: true,
                },
            },
            announcements: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 10,
            },
            learningMaterials: {
                orderBy: {
                    createdAt: 'desc',
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
                },
            },
            Assignment: {
                where: {
                    status: "PUBLISHED",
                },
                orderBy: {
                    dueDate: 'asc',
                },
                include: {
                    submissions: {
                        where: {
                            studentId: student.id,
                        },
                    },
                },
            },
        },
    });

    if (!classData) {
        notFound();
    }

    // Get participants (teacher and students)
    const participants = await prisma.student.findMany({
        where: {
            sectionId: classData.sectionId,
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    gender: true,
                },
            },
        },
        orderBy: {
            user: {
                firstName: 'asc',
            },
        },
    });

    // Get grades for this student in this class
    const grades = await prisma.grade.findMany({
        where: {
            studentId: student.id,
            classId: classId,
        },
        include: {
            assignment: {
                select: {
                    title: true,
                    maxScore: true,
                },
            },
        },
        orderBy: {
            gradedAt: 'desc',
        },
    });

    // Calculate overall grade statistics
    const gradeStats = calculateGradeStats(grades);

    // Render content based on current tab
    const renderContent = () => {
        switch (currentTab) {
            case 'participants':
                return (
                    <SubjectParticipants
                        participants={participants}
                        teacher={classData.teacher}
                        classId={classId}
                    />
                );
            case 'grades':
                return (
                    <SubjectGrades
                        grades={grades}
                        gradeStats={gradeStats}
                        classId={classId}
                    />
                );
            default:
                return (
                    <SubjectContent
                        classData={classData}
                        studentId={student.id}
                        grades={grades}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <Link
                            href="/student/subjects"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to My Subjects
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Subject Header */}
                <SubjectHeader
                    classData={classData}
                    student={student}
                    gradeStats={gradeStats}
                />

                {/* Subject Navigation */}
                <SubjectNavigation classId={classId} currentTab={currentTab} />

                {/* Main Content */}
                <div className="mt-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

function calculateGradeStats(grades: any[]) {
    if (grades.length === 0) {
        return {
            average: 0,
            highest: 0,
            lowest: 0,
            total: 0,
            completed: 0,
        };
    }

    const scores = grades.map(grade => grade.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    return {
        average: Math.round(average * 100) / 100,
        highest: Math.round(highest * 100) / 100,
        lowest: Math.round(lowest * 100) / 100,
        total: grades.length,
        completed: grades.filter(grade => grade.score !== null).length,
    };
}