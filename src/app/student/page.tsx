// src/app/student/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import StudentHomePage from "@/components/student/dashboard/StudentHomePage";

export default async function StudentHomePageWrapper() {
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
    const classes = await Promise.all(
        student.section.classes.map(async (classItem) => {
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
        <StudentHomePage
            classes={classes}
            studentName={student.user.firstName}
            gradeLevel={student.section.gradeLevel}
            sectionName={student.section.name}
        />
    );
}

// Helper function for server component
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