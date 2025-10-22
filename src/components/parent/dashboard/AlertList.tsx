'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, BookOpen, User, X } from "lucide-react";

interface Alert {
    id: string;
    message: string;
    viewed: boolean;
    createdAt: Date;
    type: 'OVERDUE_ASSIGNMENT' | 'GRADE_POSTED' | 'ATTENDANCE_ISSUE';
}

interface AlertListProps {
    alerts: Alert[];
    parentId: string;
}

export function AlertList({ alerts: initialAlerts, parentId }: AlertListProps) {
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

    const markAsViewed = async (alertId: string) => {
        try {
            const response = await fetch('/api/parent/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    alertId,
                    action: 'mark-viewed',
                }),
            });

            if (response.ok) {
                setAlerts(prev =>
                    prev.map(alert =>
                        alert.id === alertId ? { ...alert, viewed: true } : alert
                    )
                );
            }
        } catch (error) {
            console.error('Failed to mark alert as viewed:', error);
        }
    };

    const getAlertIcon = (type: Alert['type']) => {
        switch (type) {
            case 'OVERDUE_ASSIGNMENT':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'GRADE_POSTED':
                return <BookOpen className="h-5 w-5 text-green-500" />;
            case 'ATTENDANCE_ISSUE':
                return <User className="h-5 w-5 text-yellow-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getAlertVariant = (type: Alert['type']) => {
        switch (type) {
            case 'OVERDUE_ASSIGNMENT':
                return "destructive";
            case 'GRADE_POSTED':
                return "default";
            case 'ATTENDANCE_ISSUE':
                return "secondary";
            default:
                return "outline";
        }
    };

    const getTypeText = (type: Alert['type']) => {
        switch (type) {
            case 'OVERDUE_ASSIGNMENT':
                return "Overdue";
            case 'GRADE_POSTED':
                return "Grade";
            case 'ATTENDANCE_ISSUE':
                return "Attendance";
            default:
                return "Info";
        }
    };

    const unreadAlerts = alerts.filter(alert => !alert.viewed);
    const readAlerts = alerts.filter(alert => alert.viewed);

    if (alerts.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">
                        No alerts at the moment. You're all up to date with your children's progress.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Unread Alerts */}
            {unreadAlerts.length > 0 && (
                <Card className="border-l-4 border-l-red-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-900">
                            <AlertTriangle className="h-5 w-5" />
                            Unread Alerts ({unreadAlerts.length})
                        </CardTitle>
                        <CardDescription>
                            Requires your attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {unreadAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-start justify-between p-4 border border-red-200 rounded-lg bg-red-50"
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        {getAlertIcon(alert.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                                                    {getTypeText(alert.type)}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(alert.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-900">{alert.message}</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsViewed(alert.id)}
                                        className="ml-2 flex-shrink-0"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Read Alerts */}
            {readAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Read Alerts ({readAlerts.length})
                        </CardTitle>
                        <CardDescription>
                            Previously viewed notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {readAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-start justify-between p-4 border rounded-lg bg-gray-50"
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        {getAlertIcon(alert.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {getTypeText(alert.type)}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(alert.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{alert.message}</p>
                                        </div>
                                    </div>

                                    <div className="w-8"></div> {/* Spacer for alignment */}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}