import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Megaphone, BookOpen, School, Calendar } from "lucide-react";

interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}

interface Announcement {
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
        section: {
            gradeLevel: number;
            name: string;
        };
    } | null;
}

interface RecentAnnouncementsProps {
    announcements: Announcement[];
    students: Student[];
}

export function RecentAnnouncements({ announcements, students }: RecentAnnouncementsProps) {
    const getAnnouncementType = (announcement: Announcement) => {
        if (!announcement.class) return 'SCHOOL_WIDE';
        return 'CLASS_SPECIFIC';
    };

    const getTypeIcon = (type: string) => {
        if (type === 'SCHOOL_WIDE') return <School className="h-4 w-4 text-blue-500" />;
        return <BookOpen className="h-4 w-4 text-green-500" />;
    };

    const getTypeColor = (type: string) => {
        if (type === 'SCHOOL_WIDE') return 'text-blue-600 bg-blue-100';
        return 'text-green-600 bg-green-100';
    };

    const getTypeText = (type: string) => {
        if (type === 'SCHOOL_WIDE') return 'School Announcement';
        return 'Class Announcement';
    };

    const isRelevantToStudent = (announcement: Announcement, student: Student) => {
        if (!announcement.class) return true; // School-wide announcements are relevant to all

        return (
            announcement.class.section.gradeLevel === student.section.gradeLevel &&
            announcement.class.section.name === student.section.name
        );
    };

    const getRelevantStudents = (announcement: Announcement) => {
        return students.filter(student => isRelevantToStudent(announcement, student));
    };

    const formatContentPreview = (content: string, maxLength: number = 100): string => {
        // Remove HTML tags and get plain text
        const plainText = content.replace(/<[^>]*>/g, '');

        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
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

        return date.toLocaleDateString();
    };

    if (announcements.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5" />
                        Recent Announcements
                    </CardTitle>
                    <CardDescription>
                        Latest updates from school and teachers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No recent announcements</p>
                        <p className="text-sm mt-1">Check back later for updates</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Recent Announcements
                </CardTitle>
                <CardDescription>
                    Latest updates from school and teachers
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {announcements.slice(0, 5).map((announcement) => {
                        const type = getAnnouncementType(announcement);
                        const relevantStudents = getRelevantStudents(announcement);

                        return (
                            <div
                                key={announcement.id}
                                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(type)}
                                        <h4 className="font-semibold text-sm text-gray-900">
                                            {announcement.title}
                                        </h4>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`text-xs ${getTypeColor(type)}`}
                                    >
                                        {getTypeText(type)}
                                    </Badge>
                                </div>

                                {/* Content Preview */}
                                <p className="text-sm text-gray-600 mb-3">
                                    {formatContentPreview(announcement.content)}
                                </p>

                                {/* Meta Information */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">From:</span>
                                            <span>
                                                {announcement.teacher.user.firstName} {announcement.teacher.user.lastName}
                                            </span>
                                        </div>

                                        {announcement.class && (
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">Class:</span>
                                                <span>{announcement.class.subjectName}</span>
                                            </div>
                                        )}

                                        {/* Relevant Students */}
                                        {relevantStudents.length > 0 && relevantStudents.length < students.length && (
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">For:</span>
                                                <span>
                                                    {relevantStudents.map(s => s.user.firstName).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 text-right">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatTimeAgo(new Date(announcement.createdAt))}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Link */}
                {announcements.length > 5 && (
                    <div className="mt-4 pt-4 border-t">
                        <Link href="/parent/announcements">
                            <Button variant="outline" size="sm" className="w-full">
                                View All Announcements
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}