// src/lib/alert-service.ts
import prisma from "./prisma";

export interface IncompleteTaskAlert {
    studentId: string;
    assignmentId: string;
    assignmentTitle: string;
    dueDate: Date;
    daysUntilDue: number;
    subject: string;
}

export class AlertService {
    // Generate alerts for incomplete assignments
    static async generateIncompleteTaskAlerts(): Promise<void> {
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

        // Find assignments due in the next 2 days that aren't submitted
        const incompleteAssignments = await prisma.assignment.findMany({
            where: {
                dueDate: {
                    lte: twoDaysFromNow,
                    gte: now,
                },
                status: "PUBLISHED",
                submissions: {
                    none: {
                        status: {
                            in: ["SUBMITTED", "GRADED"]
                        }
                    }
                }
            },
            include: {
                class: {
                    include: {
                        section: {
                            include: {
                                students: {
                                    include: {
                                        parent: true
                                    }
                                }
                            }
                        },
                        teacher: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Create alerts for each incomplete assignment
        for (const assignment of incompleteAssignments) {
            for (const student of assignment.class.section.students) {
                // Check if student hasn't submitted
                const submission = await prisma.assignmentSubmission.findFirst({
                    where: {
                        assignmentId: assignment.id,
                        studentId: student.id,
                        status: {
                            in: ["SUBMITTED", "GRADED"]
                        }
                    }
                });

                if (!submission && student.parent) {
                    await this.createIncompleteAssignmentAlert(
                        student.parent.id,
                        student.id,
                        assignment
                    );
                }
            }
        }
    }

    private static async createIncompleteAssignmentAlert(
        parentId: string,
        studentId: string,
        assignment: any
    ) {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let urgency = "";
        if (daysUntilDue === 0) urgency = "Due today!";
        else if (daysUntilDue === 1) urgency = "Due tomorrow!";
        else urgency = `Due in ${daysUntilDue} days`;

        const message = `${student?.user.firstName} has pending assignment: "${assignment.title}" for ${assignment.class.subjectName}. ${urgency}`;

        // Check if alert already exists
        const existingAlert = await prisma.alert.findFirst({
            where: {
                parentId,
                message: {
                    contains: assignment.title
                },
                viewed: false
            }
        });

        if (!existingAlert) {
            await prisma.alert.create({
                data: {
                    parentId,
                    message,
                    viewed: false
                }
            });
        }
    }

    // Get alerts for a parent
    static async getParentAlerts(parentId: string) {
        return await prisma.alert.findMany({
            where: { parentId },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Mark alert as viewed
    static async markAlertAsViewed(alertId: string) {
        return await prisma.alert.update({
            where: { id: alertId },
            data: { viewed: true }
        });
    }

    // Mark all alerts as viewed
    static async markAllAlertsAsViewed(parentId: string) {
        return await prisma.alert.updateMany({
            where: {
                parentId,
                viewed: false
            },
            data: { viewed: true }
        });
    }
}