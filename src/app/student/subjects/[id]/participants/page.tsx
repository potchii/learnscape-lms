// src/app/student/subjects/[id]/participants/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ParticipantsPage({ params }: PageProps) {
    const session = await requireSession(["STUDENT", "ADMIN"]);
    const classId = params.id;

    // Get student and verify access
    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
        },
    });

    if (!student) {
        notFound();
    }

    // Get class info
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
        },
    });

    if (!classData) {
        notFound();
    }

    // Get all participants (students in the same section)
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <Link
                            href={`/student/subjects/${classId}`}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to {classData.subjectName}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Participants - {classData.subjectName}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Grade {classData.section.gradeLevel} • {classData.section.name}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Teacher Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Teacher</h2>
                            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                                <div className="flex-shrink-0 h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {classData.teacher.user.firstName[0]}{classData.teacher.user.lastName[0]}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {classData.teacher.user.firstName} {classData.teacher.user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">{classData.teacher.user.email}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-1">Teacher</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Students ({participants.length})
                                </h2>
                                <p className="text-gray-600 mt-1">Class roster</p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-3">
                                    {participants.map((student, index) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <span className="text-green-600 font-semibold text-sm">
                                                            {student.user.firstName[0]}{student.user.lastName[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {student.user.firstName} {student.user.lastName}
                                                        {student.id === session.user.id && (
                                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                You
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{student.user.email}</p>
                                                    <p className="text-xs text-gray-500 capitalize">
                                                        {student.user.gender?.toLowerCase() || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.studentNumber}
                                                </div>
                                                <div className="text-xs text-gray-500">Student ID</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}