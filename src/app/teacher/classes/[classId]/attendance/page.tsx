// src/app/teacher/classes/[classId]/attendance/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import TakeAttendanceForm from '@/components/teacher/classes/attendance/TakeAttendanceForm';
import AttendanceHistory from '@/components/teacher/classes/attendance/AttendanceHistory';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function TakeAttendancePage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId } = await params;

    const classData = await prisma.class.findUnique({
        where: {
            id: classId,
            teacher: {
                userId: session.user.id,
            },
        },
        include: {
            section: {
                include: {
                    students: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                        orderBy: {
                            user: {
                                lastName: 'asc',
                            },
                        },
                    },
                },
            },
            teacher: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    // Get all attendance dates for this class (for the date picker)
    const attendanceDates = await prisma.attendance.findMany({
        where: {
            classId,
        },
        distinct: ['date'],
        select: {
            date: true,
        },
        orderBy: {
            date: 'desc',
        },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-gray-600 mt-2">
                    {classData.subjectName} - Grade {classData.section.gradeLevel} - {classData.section.name}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Take Attendance Section */}
                <div className="lg:col-span-2">
                    <TakeAttendanceForm
                        classId={classId}
                        teacherId={classData.teacher.id}
                        students={classData.section.students}
                        existingDates={attendanceDates.map(d => d.date)}
                    />
                </div>

                {/* Quick Stats & History Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                <p>• Select any date to take attendance</p>
                                <p>• Record for past or future dates</p>
                                <p>• View existing attendance records</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance History</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            View attendance records for specific date ranges
                        </p>
                        <AttendanceHistory
                            classId={classId}
                            students={classData.section.students}
                            availableDates={attendanceDates.map(d => d.date)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}