'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface Alert {
    id: string;
    message: string;
    viewed: boolean;
    createdAt: Date;
}

interface AlertSystemProps {
    parentId: string;
    initialAlerts: Alert[];
}

export function AlertSystem({ parentId, initialAlerts }: AlertSystemProps) {
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
    const [isExpanded, setIsExpanded] = useState(false);

    const unviewedAlerts = alerts.filter(alert => !alert.viewed);
    const displayedAlerts = isExpanded ? alerts : alerts.slice(0, 3);

    const markAsViewed = async (alertId: string) => {
        try {
            const response = await fetch(`/api/parent/alerts`, {
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

    const markAllAsViewed = async () => {
        try {
            const response = await fetch(`/api/parent/alerts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'mark-all-viewed',
                    parentId,
                }),
            });

            if (response.ok) {
                setAlerts(prev => prev.map(alert => ({ ...alert, viewed: true })));
            }
        } catch (error) {
            console.error('Failed to mark all alerts as viewed:', error);
        }
    };

    const getAlertIcon = (message: string) => {
        if (message.toLowerCase().includes('missing') || message.toLowerCase().includes('overdue')) {
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        }
        if (message.toLowerCase().includes('grade') || message.toLowerCase().includes('score')) {
            return <Info className="h-4 w-4 text-blue-500" />;
        }
        return <Bell className="h-4 w-4 text-yellow-500" />;
    };

    const getAlertVariant = (message: string) => {
        if (message.toLowerCase().includes('missing') || message.toLowerCase().includes('overdue')) {
            return "destructive";
        }
        if (message.toLowerCase().includes('grade') || message.toLowerCase().includes('score')) {
            return "default";
        }
        return "secondary";
    };

    if (alerts.length === 0) {
        return null;
    }

    return (
        <Card className="border-l-4 border-l-yellow-400">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-yellow-500" />
                        <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
                        {unviewedAlerts.length > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {unviewedAlerts.length} new
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {unviewedAlerts.length > 0 && (
                            <Button variant="outline" size="sm" onClick={markAllAsViewed}>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark all as read
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Show less' : `Show all (${alerts.length})`}
                        </Button>
                    </div>
                </div>
                <CardDescription>
                    Important updates about your children's academic progress
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {displayedAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`flex items-start justify-between p-3 rounded-lg border ${alert.viewed ? 'bg-gray-50' : 'bg-yellow-50 border-yellow-200'
                                }`}
                        >
                            <div className="flex items-start space-x-3 flex-1">
                                {getAlertIcon(alert.message)}
                                <div className="flex-1">
                                    <p className={`text-sm ${alert.viewed ? 'text-gray-600' : 'text-gray-900'}`}>
                                        {alert.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(alert.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(alert.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            {!alert.viewed && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsViewed(alert.id)}
                                    className="ml-2 flex-shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {alerts.length > 3 && !isExpanded && (
                    <div className="mt-4 text-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExpanded(true)}
                        >
                            Show {alerts.length - 3} more alerts
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}