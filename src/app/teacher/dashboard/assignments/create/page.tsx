import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CreateAssignmentForm } from "./CreateAssignmentForm";

export default async function CreateAssignmentPage() {
    const session = await requireSession(["TEACHER", "ADMIN"]);

    const teacher = await prisma.teacher.findFirst({
        where: { userId: session.user.id },
        include: {
            classes: {
                include: {
                    section: true,
                },
                orderBy: {
                    subjectName: 'asc',
                },
            },
        },
    });

    if (!teacher) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Teacher Record Not Found</h2>
                    <p className="text-red-600">We couldn't find your teacher information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <Link
                        href="/teacher/dashboard"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
                <p className="text-gray-600">Create a new assignment for your students</p>
            </div>

            <CreateAssignmentForm teacher={teacher} classes={teacher.classes} />
        </div>
    );
}