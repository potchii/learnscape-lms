import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import CreateSectionButton from "@/components/admin/section/CreateSectionButton";
import Link from "next/link";

interface SectionWithStats {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Array<{ id: string }>;
}

export default async function SectionsManagementPage() {
    const session = await requireSession("ADMIN");

    const sections: SectionWithStats[] = await prisma.section.findMany({
        include: {
            students: {
                select: { id: true }
            },
            classes: {
                select: { id: true }
            },
        },
        orderBy: [
            { gradeLevel: 'asc' },
            { name: 'asc' },
        ],
    });

    // Group sections by grade level for better organization
    const sectionsByGrade = sections.reduce((acc, section) => {
        if (!acc[section.gradeLevel]) {
            acc[section.gradeLevel] = [];
        }
        acc[section.gradeLevel].push(section);
        return acc;
    }, {} as Record<number, SectionWithStats[]>);

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Section Management</h1>
                    <p className="text-gray-600">Manage class sections and grade levels</p>
                </div>
                <CreateSectionButton />
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-gray-900">{sections.length}</div>
                    <div className="text-sm text-gray-600">Total Sections</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-blue-600">
                        {sections.reduce((sum, section) => sum + section.students.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-green-600">
                        {sections.reduce((sum, section) => sum + section.classes.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-purple-600">
                        {Object.keys(sectionsByGrade).length}
                    </div>
                    <div className="text-sm text-gray-600">Grade Levels</div>
                </div>
            </div>

            {/* Enhanced Sections by Grade Level */}
            <div className="space-y-6">
                {Object.entries(sectionsByGrade).map(([gradeLevel, gradeSections]) => {
                    const totalStudents = gradeSections.reduce((sum, section) => sum + section.students.length, 0);
                    const totalClasses = gradeSections.reduce((sum, section) => sum + section.classes.length, 0);

                    // Grade level color coding
                    const gradeColors = {
                        1: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
                        2: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
                        3: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" },
                        4: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" },
                        5: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-800" },
                        6: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800" },
                    };

                    const gradeColor = gradeColors[gradeLevel as keyof typeof gradeColors] ||
                        { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800" };

                    return (
                        <div key={gradeLevel} className={`bg-white rounded-lg shadow-lg border ${gradeColor.border}`}>
                            {/* Grade Level Header */}
                            <div className={`${gradeColor.bg} border-b ${gradeColor.border} px-6 py-4`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className={`text-2xl font-bold ${gradeColor.text} mb-1`}>
                                            Grade {gradeLevel}
                                        </h2>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {totalStudents} student(s)
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {totalClasses} class(es)
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                {gradeSections.length} section(s)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Grade Level Quick Stats */}
                                    <div className="text-right">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                            Active
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Avg: {gradeSections.length > 0 ? Math.round(totalStudents / gradeSections.length) : 0} students/section
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sections List */}
                            <div className="divide-y divide-gray-200">
                                {gradeSections.map((section) => (
                                    <div key={section.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {section.name} Section
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gradeColor.bg} ${gradeColor.text}`}>
                                                        Grade {section.gradeLevel}
                                                    </span>
                                                </div>
                                                <div className="flex space-x-6 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <span>{section.students.length} enrolled</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        <span>{section.classes.length} classes</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>Active</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/admin/sections/${section.id}/students`}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Students
                                                </Link>
                                                <Link
                                                    href={`/admin/sections/${section.id}/edit`}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Manage
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {sections.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No sections created yet</h3>
                        <p className="text-gray-500 mb-4">
                            Create your first section to start organizing students into classes.
                        </p>
                        <CreateSectionButton />
                    </div>
                )}
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">About Sections:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Sections</strong> represent class groups within each grade level (e.g., Grade 1-A, Grade 1-B)</li>
                    <li>• Each section can have multiple students and classes</li>
                    <li>• Students are assigned to sections during approval or manual creation</li>
                    <li>• Teachers can be assigned to teach classes in specific sections</li>
                </ul>
            </div>
        </div>
    );
}