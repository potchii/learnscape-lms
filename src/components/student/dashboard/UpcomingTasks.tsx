// src/app/student/dashboard/UpcomingTasks.tsx
import Link from "next/link";

interface Task {
    id: string;
    title: string;
    type: 'ASSIGNMENT' | 'QUIZ';
    dueDate: Date;
    subject: string;
    subjectColor: string;
    status: 'PENDING' | 'SUBMITTED' | 'OVERDUE';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface UpcomingTasksProps {
    tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUBMITTED': return '✅';
            case 'OVERDUE': return '⏰';
            default: return '📝';
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'ASSIGNMENT' ? '📄' : '📝';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
                <p className="text-sm text-gray-600">Assignments and quizzes due soon</p>
            </div>

            <div className="p-6">
                {tasks.length > 0 ? (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <span className="text-lg">{getTypeIcon(task.type)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 text-sm">
                                            {task.title}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Due {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">{getStatusIcon(task.status)}</span>
                                    <Link
                                        href={`/student/subjects/${task.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-3">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming tasks</h3>
                        <p className="text-gray-500">You're all caught up!</p>
                    </div>
                )}

                {tasks.length > 0 && (
                    <div className="mt-4 text-center">
                        <Link
                            href="/student/subjects"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all tasks →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}