// src/app/student/subjects/[id]/SubjectContent.tsx
import Link from "next/link";

interface SubjectContentProps {
    classData: any;
    studentId: string;
    grades: any[];
}

export function SubjectContent({ classData, studentId, grades }: SubjectContentProps) {
    // Group content by type for better organization
    const announcements = classData.announcements || [];
    const materials = classData.learningMaterials || [];
    const assignments = classData.Assignment || [];

    return (
        <div className="space-y-6">
            {/* Announcements Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <span className="mr-3">📢</span>
                        Announcements
                    </h2>
                    <p className="text-gray-600 mt-1">Latest updates from your teacher</p>
                </div>

                <div className="p-6">
                    {announcements.length > 0 ? (
                        <div className="space-y-4">
                            {announcements.map((announcement: any) => (
                                <div
                                    key={announcement.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                                        <span className="text-sm text-gray-500">
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                                    <div className="text-xs text-gray-500">
                                        Posted by {classData.teacher.user.firstName} {classData.teacher.user.lastName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No announcements yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Learning Materials Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <span className="mr-3">📚</span>
                        Learning Materials
                    </h2>
                    <p className="text-gray-600 mt-1">Study resources and materials</p>
                </div>

                <div className="p-6">
                    {materials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {materials.map((material: any) => (
                                <div
                                    key={material.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${getMaterialColor(material.type)}`}>
                                            <span className="text-white text-sm">
                                                {getMaterialIcon(material.type)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                                {material.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {material.teacher.user.firstName} {material.teacher.user.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    {material.description && (
                                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                            {material.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="capitalize">{material.type.toLowerCase()}</span>
                                        <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="mt-3 flex space-x-2">
                                        <a
                                            href={material.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            {material.type === 'LINK' ? 'Visit' : 'View'}
                                        </a>

                                        {material.type === 'DOCUMENT' && (
                                            <a
                                                href={material.url}
                                                download
                                                className="px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                                            >
                                                Download
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No learning materials available yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Assignments Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <span className="mr-3">📝</span>
                        Assignments & Activities
                    </h2>
                    <p className="text-gray-600 mt-1">Tasks and assessments</p>
                </div>

                <div className="p-6">
                    {assignments.length > 0 ? (
                        <div className="space-y-4">
                            {assignments.map((assignment: any) => {
                                const submission = assignment.submissions[0];
                                const status = getAssignmentStatus(assignment, submission);

                                return (
                                    <div
                                        key={assignment.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                                                {assignment.description && (
                                                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                        {assignment.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                {status}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
                                            <div className="space-y-1">
                                                <div>
                                                    <span className="font-medium">Due:</span>{' '}
                                                    {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                                                    {new Date(assignment.dueDate).toLocaleTimeString()}
                                                </div>
                                                {assignment.maxScore && (
                                                    <div>
                                                        <span className="font-medium">Max Score:</span> {assignment.maxScore}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-right">
                                                {submission && submission.score !== null && (
                                                    <div className="text-green-600 font-medium">
                                                        Score: {submission.score}/{assignment.maxScore}
                                                    </div>
                                                )}
                                                {submission && submission.feedback && (
                                                    <div className="text-blue-600">
                                                        Feedback provided
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex space-x-2">
                                            <Link
                                                href={`/student/dashboard/assignments/${assignment.id}`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                                            >
                                                {submission ? 'View Submission' : 'Submit Work'}
                                            </Link>

                                            {submission && submission.fileUrl && (
                                                <a
                                                    href={submission.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    Download Submission
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No assignments available yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

// Helper functions for materials and assignments
function getMaterialIcon(type: string): string {
    switch (type) {
        case 'VIDEO': return '🎬';
        case 'IMAGE': return '🖼️';
        case 'DOCUMENT': return '📄';
        case 'LINK': return '🔗';
        default: return '📎';
    }
}

function getMaterialColor(type: string): string {
    switch (type) {
        case 'VIDEO': return 'bg-red-500';
        case 'IMAGE': return 'bg-green-500';
        case 'DOCUMENT': return 'bg-blue-500';
        case 'LINK': return 'bg-purple-500';
        default: return 'bg-gray-500';
    }
}

function getAssignmentStatus(assignment: any, submission: any): string {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);

    if (submission) {
        if (submission.status === 'GRADED') return 'Graded';
        if (submission.status === 'SUBMITTED') return 'Submitted';
        if (submission.status === 'LATE') return 'Late';
    }

    if (dueDate < now) return 'Overdue';
    if (dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'Due Soon';

    return 'Not Submitted';
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'Graded': return 'bg-green-100 text-green-800';
        case 'Submitted': return 'bg-blue-100 text-blue-800';
        case 'Late': return 'bg-orange-100 text-orange-800';
        case 'Overdue': return 'bg-red-100 text-red-800';
        case 'Due Soon': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}