import prisma from "./prisma";

export interface AlertData {
    id: string;
    message: string;
    viewed: boolean;
    createdAt: Date;
    type: 'OVERDUE_ASSIGNMENT' | 'GRADE_POSTED' | 'ATTENDANCE_ISSUE';
    studentId?: string;
    assignmentId?: string;
}

export class AlertService {
    /**
     * Generate alerts for parents when their children have overdue assignments
     */
    static async generateOverdueAssignmentAlerts(): Promise<void> {
        try {
            const now = new Date();

            // Find all overdue assignments with students who haven't submitted
            const overdueAssignments = await prisma.assignment.findMany({
                where: {
                    dueDate: {
                        lt: now, // Due date is in the past
                    },
                    status: 'PUBLISHED',
                },
                include: {
                    class: {
                        include: {
                            section: {
                                include: {
                                    students: {
                                        include: {
                                            parent: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    submissions: true,
                },
            });

            for (const assignment of overdueAssignments) {
                const students = assignment.class.section.students;

                for (const student of students) {
                    // Check if student hasn't submitted this assignment
                    const submission = assignment.submissions.find(sub => sub.studentId === student.id);

                    if (!submission || submission.status !== 'SUBMITTED') {
                        // Create alert for parent
                        await this.createOverdueAssignmentAlert(
                            student.parent.id,
                            student.id,
                            assignment
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error generating overdue assignment alerts:', error);
        }
    }

    /**
     * Create an overdue assignment alert for a parent
     */
    private static async createOverdueAssignmentAlert(
        parentId: string,
        studentId: string,
        assignment: any
    ): Promise<void> {
        try {
            const student = await prisma.student.findUnique({
                where: { id: studentId },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });

            if (!student) return;

            const message = `Overdue assignment: ${student.user.firstName} ${student.user.lastName} has not submitted "${assignment.title}" for ${assignment.class.subjectName}. Due: ${assignment.dueDate.toLocaleDateString()}`;

            // Check if alert already exists to avoid duplicates
            const existingAlert = await prisma.alert.findFirst({
                where: {
                    parentId,
                    message: {
                        contains: assignment.title,
                    },
                    viewed: false,
                },
            });

            if (!existingAlert) {
                await prisma.alert.create({
                    data: {
                        parentId,
                        message,
                        viewed: false,
                    },
                });
            }
        } catch (error) {
            console.error('Error creating overdue assignment alert:', error);
        }
    }

    /**
     * Get alerts for a parent
     */
    static async getParentAlerts(parentId: string): Promise<AlertData[]> {
        try {
            const alerts = await prisma.alert.findMany({
                where: { parentId },
                orderBy: { createdAt: 'desc' },
                take: 50, // Limit to recent 50 alerts
            });

            return alerts.map(alert => ({
                id: alert.id,
                message: alert.message,
                viewed: alert.viewed,
                createdAt: alert.createdAt,
                type: this.determineAlertType(alert.message),
            }));
        } catch (error) {
            console.error('Error fetching parent alerts:', error);
            return [];
        }
    }

    /**
     * Mark an alert as viewed
     */
    static async markAlertAsViewed(alertId: string): Promise<void> {
        try {
            await prisma.alert.update({
                where: { id: alertId },
                data: { viewed: true },
            });
        } catch (error) {
            console.error('Error marking alert as viewed:', error);
        }
    }

    /**
     * Mark all alerts as viewed for a parent
     */
    static async markAllAlertsAsViewed(parentId: string): Promise<void> {
        try {
            await prisma.alert.updateMany({
                where: {
                    parentId,
                    viewed: false,
                },
                data: { viewed: true },
            });
        } catch (error) {
            console.error('Error marking all alerts as viewed:', error);
        }
    }

    /**
     * Get unread alert count for a parent
     */
    static async getUnreadAlertCount(parentId: string): Promise<number> {
        try {
            return await prisma.alert.count({
                where: {
                    parentId,
                    viewed: false,
                },
            });
        } catch (error) {
            console.error('Error getting unread alert count:', error);
            return 0;
        }
    }

    /**
     * Determine alert type based on message content
     */
    private static determineAlertType(message: string): AlertData['type'] {
        if (message.toLowerCase().includes('overdue') || message.toLowerCase().includes('due')) {
            return 'OVERDUE_ASSIGNMENT';
        }
        if (message.toLowerCase().includes('grade') || message.toLowerCase().includes('score')) {
            return 'GRADE_POSTED';
        }
        if (message.toLowerCase().includes('absent') || message.toLowerCase().includes('attendance')) {
            return 'ATTENDANCE_ISSUE';
        }
        return 'OVERDUE_ASSIGNMENT'; // Default
    }
}