import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ParentWithDetails {
    id: string;
    parentNumber: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string | null;
        address: string;
        createdAt: Date;
    };
    students: Array<{
        id: string;
        studentNumber: string;
        user: {
            firstName: string;
            lastName: string;
        };
        section: {
            id: string;
            name: string;
            gradeLevel: number;
        };
    }>;
    alerts: Array<{
        id: string;
        message: string;
        createdAt: Date;
        viewed: boolean;
    }>;
}

export default async function ParentProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const session = await requireSession("ADMIN");

    const parent: ParentWithDetails | null = await prisma.parent.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            students: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    section: true,
                },
                orderBy: {
                    user: {
                        firstName: "asc",
                    },
                },
            },
            alerts: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            },
        },
    });

    if (!parent) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
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
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                    {parent.user.firstName[0]}{parent.user.lastName[0]}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {parent.user.firstName} {parent.user.lastName}
                                </h1>
                                <p className="text-gray-600">
                                    {parent.parentNumber} • {parent.students.length} child(ren)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                            {parent.students.length}
                        </div>
                        <div className="text-sm text-gray-600">Children</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Parent Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Full Name</label>
                                <p className="text-sm text-gray-900">
                                    {parent.user.firstName} {parent.user.lastName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Parent ID</label>
                                <p className="text-sm font-mono text-gray-900">{parent.parentNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-sm text-gray-900">{parent.user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-sm text-gray-900">{parent.user.phoneNumber || "Not provided"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-sm text-gray-900">{parent.user.address}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Account Created</label>
                                <p className="text-sm text-gray-900">{parent.user.createdAt.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Children/Students */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Children</h2>
                        {parent.students.length > 0 ? (
                            <div className="space-y-4">
                                {parent.students.map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-blue-800">
                                                    {student.user.firstName[0]}{student.user.lastName[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.user.firstName} {student.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {student.studentNumber} • Grade {student.section.gradeLevel}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/admin/students/${student.id}`}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </Link>
                                            <span className="text-sm text-gray-400">|</span>
                                            <Link
                                                href={`/admin/sections/${student.section.id}/students`}
                                                className="text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                Section
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-2">
                                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">No children assigned to this parent</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Stats & Alerts */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Children</label>
                                <p className="text-2xl font-bold text-gray-900">{parent.students.length}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Unread Alerts</label>
                                <p className="text-2xl font-bold text-orange-600">
                                    {parent.alerts.filter(alert => !alert.viewed).length}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Grade Levels</label>
                                <p className="text-2xl font-bold text-purple-600">
                                    {new Set(parent.students.map(s => s.section.gradeLevel)).size}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Alerts</h2>
                        <div className="space-y-3">
                            {parent.alerts.slice(0, 3).map((alert) => (
                                <div key={alert.id} className={`p-3 rounded-lg border ${alert.viewed ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'
                                    }`}>
                                    <p className="text-sm text-gray-900 mb-1">{alert.message}</p>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-xs ${alert.viewed ? 'text-gray-500' : 'text-orange-600 font-medium'
                                            }`}>
                                            {alert.viewed ? 'Viewed' : 'New'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {alert.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {parent.alerts.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No alerts</p>
                            )}
                        </div>
                        {parent.alerts.length > 3 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <Link
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View all alerts →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                Send Message
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                Create Alert
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                View Communication History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}