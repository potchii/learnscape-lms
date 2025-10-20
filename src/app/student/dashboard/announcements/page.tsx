import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { MarkAsReadButton } from "./MarkAsReadButton";

interface AnnouncementWithDetails {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
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

export default async function StudentAnnouncementsPage() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
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

    // Fetch announcements - both school-wide and class-specific
    const announcements: AnnouncementWithDetails[] = await prisma.announcement.findMany({
        where: {
            OR: [
                // School-wide announcements (no classId)
                { classId: null },
                // Announcements for student's classes
                { class: { sectionId: student.sectionId } }
            ]
        },
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
            class: {
                select: {
                    subjectName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 20, // Limit to recent announcements
    });

    // Get view status for announcements
    const announcementViews = await prisma.announcementView.findMany({
        where: {
            userId: session.user.id,
            announcementId: {
                in: announcements.map(a => a.id)
            }
        },
        select: {
            announcementId: true,
        }
    });

    const viewedAnnouncementIds = new Set(announcementViews.map(v => v.announcementId));

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

    const unreadCount = announcements.filter(a => !viewedAnnouncementIds.has(a.id)).length;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <Link
                        href="/student/dashboard"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                        <p className="text-gray-600">
                            Stay updated with school news and important information
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {unreadCount} unread
                        </div>
                    )}
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.map((announcement) => {
                    const type = getAnnouncementType(announcement);
                    const isRead = viewedAnnouncementIds.has(announcement.id);

                    return (
                        <div
                            key={announcement.id}
                            className={`bg-white rounded-lg shadow border-l-4 ${isRead ? 'opacity-75' : 'opacity-100'
                                } ${getTypeColor(type)}`}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg">{getTypeIcon(type)}</span>
                                        <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
                                        {!isRead && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                New
                                            </span>
                                        )}
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

                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>

                                <div className="mt-4 flex justify-between items-center">
                                    {!isRead ? (
                                        <MarkAsReadButton announcementId={announcement.id} />
                                    ) : (
                                        <span className="text-green-600 text-sm font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Read
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500">
                                        {announcement.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {announcements.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                    <p className="text-gray-500">Check back later for updates from your school and teachers.</p>
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{announcements.length}</div>
                    <div className="text-sm text-gray-600">Total Announcements</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {announcements.filter(a => getAnnouncementType(a) === 'class').length}
                    </div>
                    <div className="text-sm text-gray-600">Class Updates</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {announcements.filter(a => getAnnouncementType(a) === 'school').length}
                    </div>
                    <div className="text-sm text-gray-600">School Notices</div>
                </div>
            </div>
        </div>
    );
}