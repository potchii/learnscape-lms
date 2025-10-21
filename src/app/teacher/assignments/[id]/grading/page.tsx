// src/app/teacher/assignments/[id]/grading/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AssignmentGradingForm } from "@/components/teacher/assignments/AssignmentGradingForm";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function AssignmentGradingPage({ params }: PageProps) {
    const session = await requireSession(["TEACHER"]);
    const assignmentId = params.id;

    // Get assignment with students and their submissions using correct Prisma syntax
    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId,
            teacher: {
                userId: session.user.id,
            },
        },
        include: {
            class: {
                include: {
                    section: {
                        include: {
                            students: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                    // Include submissions for this specific assignment
                                    AssignmentSubmission: {
                                        where: {
                                            assignmentId: assignmentId,
                                        },
                                    },
                                    // Include grades for this specific assignment
                                    grades: {
                                        where: {
                                            assignmentId: assignmentId,
                                        },
                                    },
                                },
                                orderBy: {
                                    user: {
                                        firstName: 'asc',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!assignment) {
        notFound();
    }

    // Transform the data to match our component's expected format
    const transformedStudents = assignment.class.section.students.map(student => ({
        id: student.id,
        studentNumber: student.studentNumber,
        user: {
            firstName: student.user.firstName,
            lastName: student.user.lastName,
        },
        submissions: student.AssignmentSubmission.map(submission => ({
            id: submission.id,
            fileUrl: submission.fileUrl,
            submittedAt: submission.submittedAt,
            status: submission.status,
        })),
        grades: student.grades.map(grade => ({
            id: grade.id,
            score: grade.score,
            remarks: grade.remarks || '',
        })),
    }));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Grade Assignment</h1>
                    <p className="text-gray-600 mt-2">Enter grades for {transformedStudents.length} students</p>
                </div>

                <AssignmentGradingForm
                    assignment={{
                        id: assignment.id,
                        title: assignment.title,
                        description: assignment.description,
                        maxScore: assignment.maxScore,
                        dueDate: assignment.dueDate,
                        class: {
                            id: assignment.classId, // Use the direct classId field
                            subjectName: assignment.class.subjectName,
                            section: {
                                name: assignment.class.section.name,
                                gradeLevel: assignment.class.section.gradeLevel,
                            },
                        },
                    }}
                    students={transformedStudents}
                />
            </div>
        </div>
    );
}