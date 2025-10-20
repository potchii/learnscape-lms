interface ClassProgressProps {
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    materialsCount: number;
}

export function ClassProgress({ progress, totalAssignments, submittedAssignments, materialsCount }: ClassProgressProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>

            <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Homework Done:</span>
                    <span className="font-semibold">{submittedAssignments}/{totalAssignments}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Learning Materials:</span>
                    <span className="font-semibold">{materialsCount}</span>
                </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800 text-center">
                    {progress >= 80 ? '🌟 Amazing work!' :
                        progress >= 60 ? '👍 Great progress!' :
                            progress >= 40 ? '📚 Keep going!' :
                                '🎒 Ready to learn!'}
                </p>
            </div>
        </div>
    );
}