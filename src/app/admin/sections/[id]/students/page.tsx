import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface StudentWithDetails {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
    };
    parent: {
        id: string;
        parentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}

interface SectionWithDetails {
    id: string;
    gradeLevel: number;
    name: string;
    students: StudentWithDetails[];
    _count: {
        students: number;
        classes: number;
    };
}

export default async function SectionStudentsPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await requireSession("ADMIN");

    const section: SectionWithDetails | null = await prisma.section.findUnique({
        where: { id: params.id },
        include: {
            students: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            gender: true,
                            birthdate: true,
                        },
                    },
                    parent: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    user: {
                        firstName: "asc",
                    },
                },
            },
            _count: {
                select: {
                    students: true,
                    classes: true,
                },
            },
        },
    });

    if (!section) {
        notFound();
    }

    const calculateAge = (birthdate: Date) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const getGenderColor = (gender: string) => {
        return gender === "MALE"
            ? "bg-blue-100 text-blue-800"
            : "bg-pink-100 text-pink-800";
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link
                                href="/admin/sections"
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Sections
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {section.name} Section - Grade {section.gradeLevel}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Student roster and management for this class section
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                            {section._count.students}
                        </div>
                        <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-gray-900">{section._count.students}</div>
                    <div className="text-sm text-gray-600">Enrolled Students</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-green-600">
                        {section._count.classes}
                    </div>
                    <div className="text-sm text-gray-600">Active Classes</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-purple-600">
                        {new Set(section.students.map(s => s.parent.id)).size}
                    </div>
                    <div className="text-sm text-gray-600">Connected Parents</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-orange-600">
                        {section.students.reduce((avg, student, _, { length }) => {
                            return avg + calculateAge(student.user.birthdate) / length;
                        }, 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Average Age</div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
                        <span className="text-sm text-gray-500">
                            Showing {section.students.length} student(s)
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Age & Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Parent/Guardian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Parent ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {section.students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Student Information */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {student.user.firstName[0]}{student.user.lastName[0]}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.user.firstName} {student.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {student.user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Student ID */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-mono text-gray-900 font-medium">
                                            {student.studentNumber}
                                        </div>
                                    </td>

                                    {/* Age & Gender */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-900">
                                                {calculateAge(student.user.birthdate)} years
                                            </span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(student.user.gender)}`}>
                                                {student.user.gender.toLowerCase()}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Parent Information */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {student.parent.user.firstName} {student.parent.user.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {student.parent.user.email}
                                        </div>
                                    </td>

                                    {/* Parent ID */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-mono text-gray-600">
                                            {student.parent.parentNumber}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/admin/students/${student.id}`}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/students/${student.id}/edit`}
                                                className="text-green-600 hover:text-green-900 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={`/admin/parents/${student.parent.id}`}
                                                className="text-purple-600 hover:text-purple-900 transition-colors"
                                            >
                                                Parent
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {section.students.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No students enrolled</h3>
                        <p className="text-gray-500 mb-4">
                            This section doesn't have any students assigned yet.
                        </p>
                        <Link
                            href="/admin/applicants"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Approve Applicants
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Student Management</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                        <li>• View student profiles and academic records</li>
                        <li>• Contact parents through the parent portal</li>
                        <li>• Monitor attendance and grades</li>
                        <li>• Transfer students between sections if needed</li>
                    </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Section Information</h3>
                    <ul className="text-green-700 text-sm space-y-1">
                        <li>• <strong>Grade Level:</strong> {section.gradeLevel}</li>
                        <li>• <strong>Section Name:</strong> {section.name}</li>
                        <li>• <strong>Total Students:</strong> {section._count.students}</li>
                        <li>• <strong>Active Classes:</strong> {section._count.classes}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}