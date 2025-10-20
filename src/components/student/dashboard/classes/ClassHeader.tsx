import { Class } from "@prisma/client";

interface ClassWithTeacher extends Class {
    teacher: {
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}

interface ClassHeaderProps {
    classItem: ClassWithTeacher;
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
}

export function ClassHeader({
    classItem,
    progress,
    totalAssignments,
    submittedAssignments
}: ClassHeaderProps) {

    const getClassIcon = (subjectName: string) => {
        const subject = subjectName.toLowerCase();
        if (subject.includes('math')) return '➗';
        if (subject.includes('science')) return '🔬';
        if (subject.includes('english') || subject.includes('reading')) return '📚';
        if (subject.includes('art')) return '🎨';
        if (subject.includes('music')) return '🎵';
        if (subject.includes('pe') || subject.includes('physical')) return '🏃‍♂️';
        if (subject.includes('history') || subject.includes('social')) return '🏛️';
        if (subject.includes('geography')) return '🌍';
        return '📝';
    };

    const getClassColor = (subjectName: string) => {
        const subject = subjectName.toLowerCase();
        if (subject.includes('math')) return 'from-blue-500 to-blue-600';
        if (subject.includes('science')) return 'from-green-500 to-green-600';
        if (subject.includes('english') || subject.includes('reading')) return 'from-purple-500 to-purple-600';
        if (subject.includes('art')) return 'from-pink-500 to-pink-600';
        if (subject.includes('music')) return 'from-yellow-500 to-yellow-600';
        if (subject.includes('pe') || subject.includes('physical')) return 'from-red-500 to-red-600';
        if (subject.includes('history') || subject.includes('social')) return 'from-orange-500 to-orange-600';
        if (subject.includes('geography')) return 'from-teal-500 to-teal-600';
        return 'from-gray-500 to-gray-600';
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'text-green-600';
        if (progress >= 60) return 'text-blue-600';
        if (progress >= 40) return 'text-yellow-600';
        if (progress >= 20) return 'text-orange-600';
        return 'text-red-600';
    };

    const getProgressIcon = (progress: number) => {
        if (progress >= 80) return '⭐';
        if (progress >= 60) return '👍';
        if (progress >= 40) return '😊';
        if (progress >= 20) return '🙂';
        return '😔';
    };

    const classIcon = getClassIcon(classItem.subjectName);
    const classColor = getClassColor(classItem.subjectName);
    const progressColor = getProgressColor(progress);
    const progressIcon = getProgressIcon(progress);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Class Banner */}
            <div className={`bg-gradient-to-r ${classColor} p-6 text-white`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-4xl bg-white bg-opacity-20 rounded-2xl p-4">
                            {classIcon}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{classItem.subjectName}</h1>
                            <p className="text-white text-opacity-90 mt-1">
                                with {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                        <div className="text-white text-opacity-90">Complete</div>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Progress Overview */}
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Your Progress</div>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-2xl">{progressIcon}</span>
                            <div>
                                <div className={`text-2xl font-bold ${progressColor}`}>
                                    {Math.round(progress)}%
                                </div>
                                <div className="text-xs text-gray-500">
                                    {submittedAssignments} of {totalAssignments} homework done
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                                className={`h-4 rounded-full transition-all duration-500 ${classColor.replace('from-', 'bg-').replace(' to-', ' ')}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Homework Stats */}
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Homework Status</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-100 text-green-800 rounded p-2">
                                <div className="font-bold">{submittedAssignments}</div>
                                <div>Done ✅</div>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 rounded p-2">
                                <div className="font-bold">{totalAssignments - submittedAssignments}</div>
                                <div>To Do 📝</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Motivational Message */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        {progress >= 80
                            ? "Great job! You're doing amazing! 🌟"
                            : progress >= 60
                                ? "You're making good progress! Keep it up! 💪"
                                : progress >= 40
                                    ? "You're getting there! Every assignment counts! 📚"
                                    : progress >= 20
                                        ? "You've made a start! Let's keep going! 🚀"
                                        : "Ready to begin your learning adventure! 🎒"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}