import Link from "next/link";
import { Assignment } from "@prisma/client";

interface AssignmentWithClass extends Assignment {
    className: string;
    classColor: string;
    class: {
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

interface UpcomingDeadlinesProps {
    assignments: AssignmentWithClass[];
}

export function UpcomingDeadlines({ assignments }: UpcomingDeadlinesProps) {
    const getColorClasses = (color: string) => {
        const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
            orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
            red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
            pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
            indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
            teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
            gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
        };
        return colorMap[color] || colorMap.gray;
    };

    const getDaysUntilDue = (dueDate: Date): string => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `In ${diffDays} days`;
        if (diffDays < 14) return 'Next week';
        return `In ${Math.ceil(diffDays / 7)} weeks`;
    };

    const getUrgencyColor = (dueDate: Date): string => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'text-red-600 bg-red-100';
        if (diffDays <= 3) return 'text-orange-600 bg-orange-100';
        if (diffDays <= 7) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Upcoming Homework</h2>
                    <p className="text-sm text-gray-600 mt-1">Assignments due soon</p>
                </div>
                <Link
                    href="/student/assignments"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    View All
                </Link>
            </div>

            <div className="p-6">
                {assignments.length > 0 ? (
                    <div className="space-y-4">
                        {assignments.slice(0, 5).map((assignment) => {
                            const colors = getColorClasses(assignment.classColor);
                            const urgencyColor = getUrgencyColor(assignment.dueDate);

                            return (
                                <div
                                    key={assignment.id}
                                    className={`border-l-4 ${colors.border} ${colors.bg} rounded-r-lg p-3 hover:shadow-sm transition-shadow`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {assignment.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {assignment.className}
                                            </p>
                                        </div>
                                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${urgencyColor}`}>
                                            {getDaysUntilDue(assignment.dueDate)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>
                                            Due: {assignment.dueDate.toLocaleDateString()} at{' '}
                                            {assignment.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {assignment.maxScore && (
                                            <span className="font-medium">
                                                {assignment.maxScore} pts
                                            </span>
                                        )}
                                    </div>

                                    {assignment.description && (
                                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                            {assignment.description}
                                        </p>
                                    )}

                                    <div className="flex space-x-2 mt-3">
                                        <Link
                                            href={`/student/assignments/${assignment.id}`}
                                            className="flex-1 text-center px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href={`/student/assignments/${assignment.id}/submit`}
                                            className="flex-1 text-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Submit Work
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No upcoming homework</p>
                        <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                    </div>
                )}

                {/* Quick Stats */}
                {assignments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                                <div className="font-semibold text-gray-900">{assignments.length}</div>
                                <div className="text-gray-600">Total Due</div>
                            </div>
                            <div>
                                <div className="font-semibold text-orange-600">
                                    {assignments.filter(a => {
                                        const due = new Date(a.dueDate);
                                        const now = new Date();
                                        return due.getTime() - now.getTime() <= 3 * 24 * 60 * 60 * 1000;
                                    }).length}
                                </div>
                                <div className="text-gray-600">This Week</div>
                            </div>
                            <div>
                                <div className="font-semibold text-red-600">
                                    {assignments.filter(a => {
                                        const due = new Date(a.dueDate);
                                        const now = new Date();
                                        return due.getDate() === now.getDate() && due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
                                    }).length}
                                </div>
                                <div className="text-gray-600">Today</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}