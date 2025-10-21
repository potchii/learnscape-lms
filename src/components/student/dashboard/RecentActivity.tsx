// src/app/student/dashboard/RecentActivity.tsx
import Link from "next/link";

interface Activity {
    id: string;
    type: 'ANNOUNCEMENT' | 'MATERIAL' | 'GRADE' | 'SUBMISSION';
    title: string;
    description: string;
    subject: string;
    timestamp: Date;
    link: string;
}

interface RecentActivityProps {
    activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'ANNOUNCEMENT': return '📢';
            case 'MATERIAL': return '📚';
            case 'GRADE': return '📊';
            case 'SUBMISSION': return '📄';
            default: return '🔔';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'ANNOUNCEMENT': return 'bg-blue-100 text-blue-800';
            case 'MATERIAL': return 'bg-green-100 text-green-800';
            case 'GRADE': return 'bg-purple-100 text-purple-800';
            case 'SUBMISSION': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return `${Math.floor(diffDays / 7)}w ago`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600">Latest updates from your subjects</p>
            </div>

            <div className="p-6">
                {activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <Link
                                key={activity.id}
                                href={activity.link}
                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                                            {activity.type.toLowerCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatTimeAgo(activity.timestamp)}
                                        </span>
                                    </div>

                                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                        {activity.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {activity.description}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {activity.subject}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-3">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No recent activity</h3>
                        <p className="text-gray-500">Updates will appear here</p>
                    </div>
                )}

                {activities.length > 0 && (
                    <div className="mt-4 text-center">
                        <Link
                            href="/student"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all activity →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}