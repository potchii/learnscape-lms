// src/app/teacher/classes/[classId]/students/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import { Mail, Phone } from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function StudentRosterPage({ params }: Props) {
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
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    phoneNumber: true,
                                },
                            },
                            parent: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            phoneNumber: true,
                                        },
                                    },
                                },
                            },
                            grades: {
                                where: {
                                    classId: classId,
                                },
                                include: {
                                    assignment: {
                                        select: {
                                            title: true,
                                            maxScore: true,
                                        },
                                    },
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
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    const calculateStudentAverage = (grades: any[]) => {
        const validGrades = grades.filter(grade =>
            grade.assignment && grade.assignment.maxScore && grade.assignment.maxScore > 0
        );

        if (validGrades.length === 0) return null;

        const totalPoints = validGrades.reduce((sum, grade) => sum + grade.score, 0);
        const totalMaxPoints = validGrades.reduce(
            (sum, grade) => sum + (grade.assignment.maxScore || 0),
            0
        );

        return totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : 0;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Student Roster</h1>
                <p className="text-gray-600 mt-2">
                    {classData.subjectName} - Grade {classData.section.gradeLevel} - {classData.section.name}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                    {classData.section.students.length} students
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Parent/Guardian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Grades
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Average
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {classData.section.students.map((student) => {
                                const average = calculateStudentAverage(student.grades);

                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {student.user.firstName} {student.user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {student.studentNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {student.user.email}
                                                </div>
                                                {student.user.phoneNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {student.user.phoneNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.parent ? (
                                                <div className="text-sm text-gray-900">
                                                    <div className="font-medium">
                                                        {student.parent.user.firstName} {student.parent.user.lastName}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {student.parent.user.email}
                                                    </div>
                                                    {student.parent.user.phoneNumber && (
                                                        <div className="text-gray-500">
                                                            {student.parent.user.phoneNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">No parent assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {student.grades.length} assignments
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {student.grades.filter(g => g.score > 0).length} graded
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {average !== null ? (
                                                <div className={`text-sm font-medium ${average >= 90 ? 'text-green-600' :
                                                        average >= 80 ? 'text-blue-600' :
                                                            average >= 70 ? 'text-yellow-600' :
                                                                'text-red-600'
                                                    }`}>
                                                    {average.toFixed(1)}%
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {classData.section.students.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No students enrolled in this class.</p>
                    </div>
                )}
            </div>
        </div>
    );
}