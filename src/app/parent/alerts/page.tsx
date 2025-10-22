import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { AlertService } from "@/lib/alert-service";
import { AlertList } from "@/components/parent/dashboard/AlertList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default async function ParentAlertsPage() {
    const session = await requireSession(['PARENT']);

    const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
    });

    if (!parent) {
        return <div>Parent not found</div>;
    }

    // Get alerts for the parent
    const alerts = await AlertService.getParentAlerts(parent.id);
    const unreadCount = await AlertService.getUnreadAlertCount(parent.id);

    // Get overdue assignments count for context
    const overdueAssignments = await prisma.assignment.findMany({
        where: {
            dueDate: {
                lt: new Date(), // Overdue
            },
            status: 'PUBLISHED',
            class: {
                section: {
                    students: {
                        some: {
                            parentId: parent.id,
                        },
                    },
                },
            },
        },
        include: {
            submissions: {
                where: {
                    student: {
                        parentId: parent.id,
                    },
                },
            },
        },
    });

    // Count actual overdue assignments (where student hasn't submitted)
    let actualOverdueCount = 0;
    overdueAssignments.forEach(assignment => {
        const hasSubmission = assignment.submissions.some(sub => sub.status === 'SUBMITTED');
        if (!hasSubmission) {
            actualOverdueCount++;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
                            <p className="text-gray-600 mt-2">
                                Important updates about your children's academic progress
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {unreadCount > 0 && (
                                <Button asChild>
                                    <form action={async () => {
                                        'use server';
                                        await AlertService.markAllAlertsAsViewed(parent.id);
                                    }}>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Mark All as Read
                                    </form>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Alert Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Alert Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">Total Alerts</span>
                                    </div>
                                    <span className="font-semibold">{alerts.length}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">Unread</span>
                                    </div>
                                    <span className="font-semibold text-red-600">{unreadCount}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">Overdue Tasks</span>
                                    </div>
                                    <span className="font-semibold text-yellow-600">{actualOverdueCount}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href="/parent/assignments#overdue">
                                        View Overdue Assignments
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href="/parent/students">
                                        Check Student Progress
                                    </a>
                                </Button>
                                <form action={async () => {
                                    'use server';
                                    await AlertService.markAllAlertsAsViewed(parent.id);
                                }}>
                                    <Button variant="outline" className="w-full justify-start" type="submit">
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Mark All as Read
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Alerts List */}
                    <div className="lg:col-span-3">
                        <AlertList
                            alerts={alerts}
                            parentId={parent.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}