import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ParentAssignmentsView } from "./ParentAssignmentsView";

export default async function ParentAssignmentsPage() {
    const session = await requireSession(["PARENT", "ADMIN"]);

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
                    section: true,
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

    // Get all assignments for all students
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
                    section: true,
                },
            },
            submissions: {
                where: {
                    studentId: {
                        in: studentIds,
                    },
                },
                include: {
                    student: {
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
        orderBy: {
            dueDate: 'asc',
        },
    });

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
                <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                <p className="text-gray-600">
                    Track your children's assignments and submissions
                </p>
            </div>

            <ParentAssignmentsView
                students={parent.students}
                assignments={assignments}
            />
        </div>
    );
}