// src/app/student/subjects/[id]/SubjectHeader.tsx
interface SubjectHeaderProps {
    classData: any;
    student: any;
    gradeStats: {
        average: number;
        highest: number;
        lowest: number;
        total: number;
        completed: number;
    };
}

export function SubjectHeader({ classData, student, gradeStats }: SubjectHeaderProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <div className="flex items-start space-x-4">
                        <div className={`h-16 w-16 rounded-lg flex items-center justify-center text-white ${getColorClasses(getClassColor(classData.subjectName))}`}>
                            <span className="text-xl font-bold">
                                {classData.subjectName.substring(0, 2).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {classData.subjectName}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Grade {classData.section.gradeLevel} • {classData.section.name}
                            </p>
                            <p className="text-gray-600">
                                Teacher: {classData.teacher.user.firstName} {classData.teacher.user.lastName}
                            </p>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{classData.announcements.length}</div>
                                    <div className="text-sm text-gray-600">Announcements</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{classData.learningMaterials.length}</div>
                                    <div className="text-sm text-gray-600">Materials</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{classData.Assignment.length}</div>
                                    <div className="text-sm text-gray-600">Assignments</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{gradeStats.total}</div>
                                    <div className="text-sm text-gray-600">Graded Items</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grade Overview */}
                <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                        <h3 className="font-semibold text-gray-900 mb-3">Grade Overview</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Average:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {gradeStats.average > 0 ? `${gradeStats.average}%` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Highest:</span>
                                <span className="text-sm font-semibold text-green-600">
                                    {gradeStats.highest > 0 ? `${gradeStats.highest}%` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Completed:</span>
                                <span className="text-sm font-semibold text-blue-600">
                                    {gradeStats.completed}/{gradeStats.total}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper functions
function getClassColor(subjectName: string): string {
    const colorMap: { [key: string]: string } = {
        mathematics: 'blue',
        math: 'blue',
        science: 'green',
        english: 'purple',
        reading: 'purple',
        writing: 'purple',
        history: 'orange',
        social: 'orange',
        geography: 'red',
        art: 'pink',
        music: 'indigo',
        'physical education': 'teal',
        pe: 'teal',
        sports: 'teal',
    };
    const normalizedName = subjectName.toLowerCase();
    return colorMap[normalizedName] || 'gray';
}

function getColorClasses(color: string): string {
    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        pink: 'bg-pink-500',
        indigo: 'bg-indigo-500',
        teal: 'bg-teal-500',
        gray: 'bg-gray-500',
    };
    return colorClasses[color] || 'bg-gray-500';
}