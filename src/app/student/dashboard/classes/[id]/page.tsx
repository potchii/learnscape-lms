import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassHeader } from "@/components/student/dashboard/classes/ClassHeader";
import { LearningMaterials } from "@/components/student/dashboard/classes/LearningMaterials";
import { ClassAssignments } from "@/components/student/dashboard/classes/ClassAssignments";
import { ClassProgress } from "@/components/student/dashboard/classes/ClassProgress";

interface PageProps {
    params: {
        id: string;
    };
}


export default async function ClassDetailPage({ params }: PageProps) {
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

    // Get the specific class with all related data
    const classItem = await prisma.class.findFirst({
        where: {
            id: params.id,
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
            Assignment: {
                where: {
                    status: "PUBLISHED",
                },
                include: {
                    submissions: {
                        where: {
                            studentId: student.id,
                        },
                    },
                },
                orderBy: {
                    dueDate: 'asc',
                },
            },
            learningMaterials: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
            announcements: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 5,
            },
        },
    });

    if (!classItem) {
        notFound();
    }

    // Calculate class progress
    const totalAssignments = classItem.Assignment.length;
    const submittedAssignments = classItem.Assignment.filter(assignment => {
        const submission = assignment.submissions[0];
        return submission && submission.status !== 'NOT_SUBMITTED';
    }).length;

    const progress = totalAssignments > 0 ? (submittedAssignments / totalAssignments) * 100 : 0;

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Back Navigation */}
            <div className="mb-6">
                <Link
                    href="/student/dashboard"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <ClassHeader
                        classItem={classItem}
                        progress={progress}
                        totalAssignments={totalAssignments}
                        submittedAssignments={submittedAssignments}
                    />

                    <LearningMaterials
                        materials={classItem.learningMaterials}
                        classId={classItem.id}
                    />

                    <ClassAssignments
                        assignments={classItem.Assignment}
                        studentId={student.id}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <ClassProgress
                        progress={progress}
                        totalAssignments={totalAssignments}
                        submittedAssignments={submittedAssignments}
                        materialsCount={classItem.learningMaterials.length}
                    />

                    {/* Teacher Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Teacher</h3>
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                                <span className="text-blue-600 font-semibold">
                                    {classItem.teacher.user.firstName[0]}{classItem.teacher.user.lastName[0]}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{classItem.teacher.user.email}</p>
                                <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Class Schedule */}
                    {classItem.schedule && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Times</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                {classItem.schedule.split(', ').map((timeSlot, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        {timeSlot}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href={`/student/assignments?class=${classItem.id}`}
                                className="block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View All Homework
                            </Link>
                            <Link
                                href={`/student/schedule`}
                                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                View My Timetable
                            </Link>
                            <button className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                Ask for Help
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}