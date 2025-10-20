import Link from "next/link";
import { Announcement } from "@prisma/client";

interface AnnouncementWithDetails extends Announcement {
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
    class: {
        subjectName: string;
    } | null;
}

interface RecentActivityFeedProps {
    announcements: AnnouncementWithDetails[];
    studentId: string;
}

export function RecentActivityFeed({ announcements, studentId }: RecentActivityFeedProps) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'announcement':
                return '📢';
            case 'assignment':
                return '📝';
            case 'material':
                return '📚';
            case 'grade':
                return '📊';
            default:
                return '🔔';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'announcement':
                return 'bg-blue-100 text-blue-600';
            case 'assignment':
                return 'bg-green-100 text-green-600';
            case 'material':
                return 'bg-purple-100 text-purple-600';
            case 'grade':
                return 'bg-orange-100 text-orange-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString();
    };

    const formatContentPreview = (content: string, maxLength: number = 80): string => {
        // Remove markdown and HTML tags
        const plainText = content
            .replace(/[#*\[\]()>`]/g, '')
            .replace(/\n/g, ' ')
            .trim();

        return plainText.length > maxLength
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    };

    // Convert announcements to activity items
    const activityItems = announcements.map(announcement => ({
        id: announcement.id,
        type: 'announcement' as const,
        title: announcement.title,
        content: announcement.content,
        author: `${announcement.teacher.user.firstName} ${announcement.teacher.user.lastName}`,
        course: announcement.class?.subjectName || 'School-wide',
        timestamp: announcement.createdAt,
        icon: getActivityIcon('announcement'),
        color: getActivityColor('announcement'),
        url: `/student/announcements#${announcement.id}`,
    }));

    // Add some mock activities for demonstration (in a real app, these would come from the database)
    const mockActivities = [
        {
            id: 'mock-assignment-1',
            type: 'assignment' as const,
            title: 'New assignment: Chapter 5 Exercises',
            content: 'Mathematics homework assigned by Mr. Smith',
            author: 'Mr. Smith',
            course: 'Mathematics',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            icon: getActivityIcon('assignment'),
            color: getActivityColor('assignment'),
            url: '/student/assignments',
        },
        {
            id: 'mock-material-1',
            type: 'material' as const,
            title: 'New study material available',
            content: 'Science lab manual uploaded for next week',
            author: 'Ms. Johnson',
            course: 'Science',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            icon: getActivityIcon('material'),
            color: getActivityColor('material'),
            url: '/student/materials',
        },
    ];

    const allActivities = [...mockActivities, ...activityItems]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 6);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600 mt-1">Latest updates from your courses</p>
            </div>

            <div className="p-6">
                {allActivities.length > 0 ? (
                    <div className="space-y-4">
                        {allActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                {/* Activity Icon */}
                                <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-lg ${activity.color}`}>
                                    {activity.icon}
                                </div>

                                {/* Activity Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {activity.title}
                                        </h3>
                                        <span className="flex-shrink-0 ml-2 text-xs text-gray-500">
                                            {formatTimeAgo(activity.timestamp)}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {formatContentPreview(activity.content)}
                                    </p>

                                    <div className="flex items-center mt-2 text-xs text-gray-500">
                                        <span className="font-medium">{activity.author}</span>
                                        <span className="mx-2">•</span>
                                        <span>{activity.course}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No recent activity</p>
                        <p className="text-gray-400 text-sm mt-1">Updates will appear here</p>
                    </div>
                )}

                {/* Activity Types Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Activity Types</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-blue-100 rounded mr-2"></span>
                            <span className="text-gray-600">Announcements</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-green-100 rounded mr-2"></span>
                            <span className="text-gray-600">Assignments</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-purple-100 rounded mr-2"></span>
                            <span className="text-gray-600">Materials</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-orange-100 rounded mr-2"></span>
                            <span className="text-gray-600">Grades</span>
                        </div>
                    </div>
                </div>

                {/* View All Link */}
                <Link
                    href="/student/activity"
                    className="block w-full mt-4 text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                    View All Activity
                </Link>
            </div>
        </div>
    );
}