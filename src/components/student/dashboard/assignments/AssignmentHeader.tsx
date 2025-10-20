import { Assignment } from "@prisma/client";

interface AssignmentWithClass extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

interface AssignmentHeaderProps {
    assignment: AssignmentWithClass;
    isPastDue: boolean;
}

export function AssignmentHeader({ assignment, isPastDue }: AssignmentHeaderProps) {
    const getUrgencyColor = () => {
        if (isPastDue) return 'bg-red-100 text-red-800 border-red-200';

        const now = new Date();
        const due = new Date(assignment.dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'bg-orange-100 text-orange-800 border-orange-200';
        if (diffDays <= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    const getUrgencyText = () => {
        if (isPastDue) return 'Past Due';

        const now = new Date();
        const due = new Date(assignment.dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Due Today';
        if (diffDays === 1) return 'Due Tomorrow';
        if (diffDays < 7) return `Due in ${diffDays} days`;
        return `Due in ${Math.ceil(diffDays / 7)} weeks`;
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-2">
                            {assignment.class.subjectName}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
                        <p className="text-gray-600 mt-2">
                            Assigned by {assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border ${getUrgencyColor()} font-semibold`}>
                        {getUrgencyText()}
                    </div>
                </div>

                {assignment.description && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-700">Due Date</div>
                        <div className="text-blue-600">{assignment.dueDate.toLocaleDateString()}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-700">Class</div>
                        <div className="text-green-600">{assignment.class.subjectName}</div>
                    </div>
                    {assignment.maxScore && (
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="font-semibold text-purple-700">Max Score</div>
                            <div className="text-purple-600">{assignment.maxScore} points</div>
                        </div>
                    )}
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-orange-700">Status</div>
                        <div className="text-orange-600">
                            {isPastDue ? 'Closed' : 'Open'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}