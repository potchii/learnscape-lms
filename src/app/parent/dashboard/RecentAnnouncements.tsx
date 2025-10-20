import { Announcement, Student } from "@prisma/client";
import Link from "next/link";

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

interface RecentAnnouncementsProps {
    announcements: AnnouncementWithDetails[];
    students: Student[];
}

export function RecentAnnouncements({ announcements, students }: RecentAnnouncementsProps) {
    const getAnnouncementType = (announcement: AnnouncementWithDetails) => {
        if (!announcement.class) return 'school';
        return 'class';
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'school':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'class':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'school':
                return '🏫';
            case 'class':
                return '📚';
            default:
                return '📢';
        }
    };

    const formatContentPreview = (content: string) => {
        // Remove markdown and HTML tags for preview
        const plainText = content.replace(/[#*\[\]()>`]/g, '').replace(/\n/g, ' ');
        return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
                    <p className="text-sm text-gray-600 mt-1">Latest updates from school and teachers</p>
                </div>
                <Link
                    href="/parent/announcements"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    View All
                </Link>
            </div>

            <div className="p-6">
                {announcements.length > 0 ? (
                    <div className="space-y-4">
                        {announcements.map((announcement) => {
                            const type = getAnnouncementType(announcement);

                            return (
                                <div
                                    key={announcement.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{getTypeIcon(type)}</span>
                                            <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {announcement.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                                        <span className="font-medium">
                                            {announcement.teacher.user.firstName} {announcement.teacher.user.lastName}
                                        </span>
                                        {announcement.class && (
                                            <>
                                                <span>•</span>
                                                <span>{announcement.class.subjectName}</span>
                                            </>
                                        )}
                                        <span>•</span>
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(type)}`}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {formatContentPreview(announcement.content)}
                                    </p>

                                    <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                                        <span>
                                            {announcement.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No recent announcements</p>
                        <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
                    </div>
                )}
            </div>
        </div>
    );
}