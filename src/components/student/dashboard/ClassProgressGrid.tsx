import Link from "next/link";

interface Class {
    id: string;
    name: string;
    teacher: string;
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    resourceCount: number;
    upcomingAssignments: Array<{
        id: string;
        title: string;
        dueDate: Date;
    }>;
    color: string;
}

interface ClassProgressGridProps {
    classes: Class[];
}

export function ClassProgressGrid({ classes }: ClassProgressGridProps) {
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

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 60) return 'bg-blue-500';
        if (progress >= 40) return 'bg-yellow-500';
        if (progress >= 20) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getClassIcon = (className: string) => {
        const name = className.toLowerCase();
        if (name.includes('math')) return '➗';
        if (name.includes('science')) return '🔬';
        if (name.includes('english') || name.includes('reading')) return '📚';
        if (name.includes('art')) return '🎨';
        if (name.includes('music')) return '🎵';
        if (name.includes('pe') || name.includes('physical')) return '🏃‍♂️';
        if (name.includes('history') || name.includes('social')) return '🏛️';
        if (name.includes('geography')) return '🌍';
        return '📝';
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">My Classes</h2>
                <p className="text-sm text-gray-600 mt-1">Progress in all your subjects</p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classes.map((classItem) => {
                        const colors = getColorClasses(classItem.color);
                        const classIcon = getClassIcon(classItem.name);

                        return (
                            <div
                                key={classItem.id}
                                className={`border rounded-lg p-4 hover:shadow-md transition-all ${colors.bg} ${colors.border}`}
                            >
                                {/* Class Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">{classIcon}</div>
                                        <div>
                                            <h3 className={`text-lg font-semibold ${colors.text}`}>
                                                {classItem.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {classItem.teacher}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {Math.round(classItem.progress)}%
                                        </div>
                                        <div className="text-xs text-gray-500">Complete</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(classItem.progress)}`}
                                        style={{ width: `${classItem.progress}%` }}
                                    ></div>
                                </div>

                                {/* Class Stats */}
                                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                    <div className="text-sm">
                                        <div className="font-semibold text-gray-900">{classItem.totalAssignments}</div>
                                        <div className="text-xs text-gray-600">Homework</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-semibold text-green-600">{classItem.submittedAssignments}</div>
                                        <div className="text-xs text-gray-600">Done</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-semibold text-blue-600">{classItem.resourceCount}</div>
                                        <div className="text-xs text-gray-600">Resources</div>
                                    </div>
                                </div>

                                {/* Upcoming Homework */}
                                {classItem.upcomingAssignments.length > 0 && (
                                    <div className="border-t border-gray-200 pt-3">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Coming Up:</h4>
                                        <div className="space-y-1">
                                            {classItem.upcomingAssignments.map((assignment) => (
                                                <div
                                                    key={assignment.id}
                                                    className="flex justify-between items-center text-xs p-2 bg-white rounded border"
                                                >
                                                    <span className="truncate flex-1 mr-2">{assignment.title}</span>
                                                    <span className="text-gray-500 whitespace-nowrap">
                                                        {assignment.dueDate.toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Class Actions */}
                                <div className="flex space-x-2 mt-4">
                                    <Link
                                        href={`/student/dashboard/classes/${classItem.id}`}
                                        className="flex-1 text-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        View Class
                                    </Link>
                                    <Link
                                        href={`/student/dashboard/assignments?class=${classItem.id}`}
                                        className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Homework
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {classes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
                        <p className="text-gray-500">You haven't been assigned to any classes yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}