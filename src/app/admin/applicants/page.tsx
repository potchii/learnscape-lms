import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface ApplicantWithUser {
    id: string;
    type: string;
    status: string;
    applicantNumber: string;
    referenceCode: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
        createdAt: Date;
    };
}

export default async function AdminApplicantsPage() {
    const session = await requireSession("ADMIN");

    const applicants: ApplicantWithUser[] = await prisma.applicant.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    gender: true,
                    birthdate: true,
                    createdAt: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        UNDER_REVIEW: "bg-blue-100 text-blue-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        WAITLISTED: "bg-purple-100 text-purple-800",
    };

    const getStatusBadge = (status: string) => {
        const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
        const label = status.replace('_', ' ');

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                {label}
            </span>
        );
    };

    const getActionButtons = (applicant: ApplicantWithUser) => {
        if (applicant.status === "PENDING") {
            return (
                <div className="space-x-2">
                    <Link
                        href={`/admin/applicants/${applicant.id}/approve`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Approve
                    </Link>
                    <Link
                        href={`/admin/applicants/${applicant.id}/reject`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Reject
                    </Link>
                    <Link
                        href={`/admin/applicants/${applicant.id}/review`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Review
                    </Link>
                </div>
            );
        }

        return (
            <span className="text-sm text-gray-500 italic">Processed</span>
        );
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Applicant Management</h1>
                        <p className="text-gray-600 mt-1">Review and manage student applications</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total: {applicants.length} application(s)
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-gray-900">{applicants.filter(a => a.status === "PENDING").length}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-blue-600">{applicants.filter(a => a.status === "UNDER_REVIEW").length}</div>
                    <div className="text-sm text-gray-600">Under Review</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-green-600">{applicants.filter(a => a.status === "APPROVED").length}</div>
                    <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-red-600">{applicants.filter(a => a.status === "REJECTED").length}</div>
                    <div className="text-sm text-gray-600">Rejected</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-2xl font-bold text-purple-600">{applicants.filter(a => a.status === "WAITLISTED").length}</div>
                    <div className="text-sm text-gray-600">Waitlisted</div>
                </div>
            </div>

            {/* Applicants Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applicant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applicant ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reference Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applicants.map((applicant) => (
                                <tr key={applicant.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {applicant.user.firstName} {applicant.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {applicant.user.email}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {applicant.user.gender.toLowerCase()} • {new Date().getFullYear() - applicant.user.birthdate.getFullYear()} years old
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                        {applicant.applicantNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">
                                            {applicant.type.toLowerCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(applicant.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {applicant.referenceCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {applicant.createdAt.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {getActionButtons(applicant)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {applicants.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg">No applications found</p>
                        <p className="text-gray-400 text-sm mt-1">When students sign up, their applications will appear here.</p>
                    </div>
                )}
            </div>

            {/* Quick Help */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">How to manage applications:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Approve</strong>: Accept applicant and create student account</li>
                    <li>• <strong>Reject</strong>: Deny the application</li>
                    <li>• <strong>Review</strong>: View full application details</li>
                    <li>• Applications move from "Pending" to "Processed" once acted upon</li>
                </ul>
            </div>
        </div>
    );
}