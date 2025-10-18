import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";


interface ClassWithStudents {
    id: string;
    subjectName: string;
    section: {
        id: string;
        name: string;
        gradeLevel: number;
        students: Array<{
            id: string;
            studentNumber: string;
            user: {
                firstName: string;
                lastName: string;
            };
            attendance: Array<{
                date: Date;
                status: string;
            }>;
        }>;
    };
}

export default async function TeacherAttendancePage() {
    const session = await requireSession("TEACHER");

    // Get teacher's classes with students using your Class table relationships
    const teacherClasses: ClassWithStudents[] = await prisma.class.findMany({
        where: {
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
                            attendance: {
                                where: {
                                    date: {
                                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                                        lt: new Date(new Date().setHours(23, 59, 59, 999)),
                                    },
                                    class: {
                                        teacher: {
                                            userId: session.user.id,
                                        },
                                    },
                                },
                                take: 1,
                            },
                        },
                        orderBy: {
                            user: {
                                firstName: "asc",
                            },
                        },
                    },
                },
            },
        },
    });

    const today = new Date().toISOString().split('T')[0];

    // Server action for attendance submission
    async function submitAttendance(formData: FormData) {
        'use server';

        const attendanceData = Object.fromEntries(formData.entries());
        const teacher = await prisma.teacher.findFirst({
            where: { userId: session.user.id }
        });

        if (!teacher) {
            throw new Error("Teacher not found");
        }

        // Process attendance records
        for (const [key, value] of Object.entries(attendanceData)) {
            if (key.startsWith('attendance-')) {
                const studentId = key.replace('attendance-', '');
                const classId = formData.get('classId') as string;

                // Upsert attendance record
                await prisma.attendance.upsert({
                    where: {
                        studentId_classId_date: {
                            studentId,
                            classId,
                            date: new Date(today),
                        },
                    },
                    update: {
                        status: value as any,
                        teacherId: teacher.id,
                    },
                    create: {
                        studentId,
                        classId,
                        teacherId: teacher.id,
                        date: new Date(today),
                        status: value as any,
                    },
                });
            }
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Daily Attendance</h1>
                <p className="text-gray-600">Record attendance for {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
                {teacherClasses.map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {classItem.subjectName}
                                </h2>
                                <p className="text-gray-600">
                                    Grade {classItem.section.gradeLevel} - {classItem.section.name} Section
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    {classItem.section.students.length} students
                                </p>
                            </div>
                        </div>

                        {/* Attendance Grid */}
                        <form action={submitAttendance}>
                            <input type="hidden" name="classId" value={classItem.id} />

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Present
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Absent
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Late
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Excused
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {classItem.section.students.map((student) => {
                                            const todayAttendance = student.attendance[0];

                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {student.user.firstName} {student.user.lastName}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {student.studentNumber}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Attendance Radio Buttons */}
                                                    {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map((status) => (
                                                        <td key={status} className="px-4 py-3 whitespace-nowrap text-center">
                                                            <input
                                                                type="radio"
                                                                name={`attendance-${student.id}`}
                                                                value={status}
                                                                defaultChecked={todayAttendance?.status === status}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                                required
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-between items-center">
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // This will be handled by client-side JavaScript
                                            if (typeof window !== 'undefined') {
                                                const radioButtons = document.querySelectorAll(`input[type="radio"][value="PRESENT"]`);
                                                radioButtons.forEach((radio: any) => {
                                                    radio.checked = true;
                                                });
                                            }
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Mark All Present
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                >
                                    Save Attendance
                                </button>
                            </div>
                        </form>
                    </div>
                ))}
            </div>

            {teacherClasses.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes assigned</h3>
                    <p className="text-gray-500">You don't have any classes assigned to you yet.</p>
                </div>
            )}
        </div>
    );
}