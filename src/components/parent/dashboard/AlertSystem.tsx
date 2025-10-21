// src/app/parent/dashboard/AlertSystem.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Alert {
    id: string;
    message: string;
    viewed: boolean;
    createdAt: string;
}

interface AlertSystemProps {
    parentId: string;
}

export function AlertSystem({ parentId }: AlertSystemProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await fetch('/api/parent/alerts');
            const data = await response.json();

            if (response.ok) {
                setAlerts(data.alerts || []);
            } else {
                toast.error('Failed to load alerts');
            }
        } catch (error) {
            toast.error('Error loading alerts');
        } finally {
            setIsLoading(false);
        }
    };

    const markAsViewed = async (alertId: string) => {
        try {
            const response = await fetch('/api/parent/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'markViewed',
                    alertId,
                }),
            });

            if (response.ok) {
                setAlerts(alerts.map(alert =>
                    alert.id === alertId ? { ...alert, viewed: true } : alert
                ));
            }
        } catch (error) {
            toast.error('Failed to update alert');
        }
    };

    const markAllAsViewed = async () => {
        try {
            const response = await fetch('/api/parent/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'markAllViewed',
                }),
            });

            if (response.ok) {
                setAlerts(alerts.map(alert => ({ ...alert, viewed: true })));
                toast.success('All alerts marked as read');
            }
        } catch (error) {
            toast.error('Failed to update alerts');
        }
    };

    const unreadAlerts = alerts.filter(alert => !alert.viewed);
    const displayedAlerts = showAll ? alerts : unreadAlerts.slice(0, 3);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                            All caught up!
                        </h3>
                        <p className="text-sm text-green-600 mt-1">
                            No pending alerts for your students.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Student Alerts
                        </h2>
                        <p className="text-sm text-gray-600">
                            {unreadAlerts.length} unread alert{unreadAlerts.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {unreadAlerts.length > 0 && (
                    <button
                        onClick={markAllAsViewed}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Alerts List */}
            <div className="p-6">
                <div className="space-y-4">
                    {displayedAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`flex items-start space-x-3 p-4 rounded-lg border ${alert.viewed
                                    ? 'bg-gray-50 border-gray-200'
                                    : 'bg-red-50 border-red-200'
                                }`}
                        >
                            <div className={`flex-shrink-0 mt-1 ${alert.viewed ? 'text-gray-400' : 'text-red-400'
                                }`}>
                                {alert.viewed ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-sm ${alert.viewed ? 'text-gray-600' : 'text-gray-900 font-medium'
                                    }`}>
                                    {alert.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(alert.createdAt).toLocaleDateString()} at{' '}
                                    {new Date(alert.createdAt).toLocaleTimeString()}
                                </p>
                            </div>

                            {!alert.viewed && (
                                <button
                                    onClick={() => markAsViewed(alert.id)}
                                    className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Show More/Less */}
                {alerts.length > 3 && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            {showAll ? 'Show fewer' : `Show all ${alerts.length} alerts`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}