// src/app/student/subjects/[id]/SubjectParticipants.tsx
import Link from "next/link";

interface SubjectParticipantsProps {
    participants: any[];
    teacher: any;
    classId: string;
}

export function SubjectParticipants({ participants, teacher, classId }: SubjectParticipantsProps) {
    return (
        <div className="space-y-6">
            {/* Teacher Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Teacher</h2>
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {teacher.user.firstName[0]}{teacher.user.lastName[0]}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">
                            {teacher.user.firstName} {teacher.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{teacher.user.email}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">Teacher</p>
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Students ({participants.length})
                            </h2>
                            <p className="text-gray-600 mt-1">Class roster</p>
                        </div>
                        <Link
                            href={`/student/subjects/${classId}/participants`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-3">
                        {participants.slice(0, 5).map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-semibold text-sm">
                                                {student.user.firstName[0]}{student.user.lastName[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {student.user.firstName} {student.user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">{student.user.email}</p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {student.user.gender?.toLowerCase() || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {student.studentNumber}
                                    </div>
                                    <div className="text-xs text-gray-500">Student ID</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {participants.length > 5 && (
                        <div className="mt-4 text-center">
                            <Link
                                href={`/student/subjects/${classId}/participants`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View all {participants.length} students →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}