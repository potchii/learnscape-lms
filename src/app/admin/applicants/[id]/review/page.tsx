import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ReviewApplicantPage({ params }: PageProps) {
    const session = await requireSession("ADMIN");

    const applicant = await prisma.applicant.findUnique({
        where: { id: params.id },
        include: {
            user: true,
        },
    });

    if (!applicant) {
        notFound();
    }

    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        UNDER_REVIEW: "bg-blue-100 text-blue-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        WAITLISTED: "bg-purple-100 text-purple-800",
    };

    const statusInfo = statusColors[applicant.status as keyof typeof statusColors];

    const calculateAge = (birthdate: Date) => {
        const today = new Date();
        const age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
            return age - 1;
        }
        return age;
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Applicant Details</h1>
                        <p className="text-gray-600">Review complete application information</p>
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusInfo}`}>
                        {applicant.status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {applicant.status === "PENDING" && (
                <div className="mb-6 flex space-x-3">
                    <Link
                        href={`/admin/applicants/${applicant.id}/approve`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Approve Application
                    </Link>
                    <Link
                        href={`/admin/applicants/${applicant.id}/reject`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Reject Application
                    </Link>
                    <Link
                        href="/admin/applicants"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to List
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Applicant Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Full Name</label>
                                <p className="text-lg font-medium text-gray-900">
                                    {applicant.user.firstName} {applicant.user.middleName && `${applicant.user.middleName} `}{applicant.user.lastName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-lg text-gray-900">{applicant.user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Gender</label>
                                <p className="text-lg text-gray-900 capitalize">{applicant.user.gender.toLowerCase()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Birthdate & Age</label>
                                <p className="text-lg text-gray-900">
                                    {applicant.user.birthdate.toLocaleDateString()}
                                    <span className="text-gray-500 text-sm ml-2">
                                        ({calculateAge(applicant.user.birthdate)} years old)
                                    </span>
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-lg text-gray-900">{applicant.user.address}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                <p className="text-lg text-gray-900">{applicant.user.phoneNumber || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Application Details Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Applicant ID</label>
                                <p className="text-lg font-mono text-blue-600">{applicant.applicantNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Reference Code</label>
                                <p className="text-lg font-mono text-gray-900">{applicant.referenceCode}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Applicant Type</label>
                                <p className="text-lg text-gray-900 capitalize">{applicant.type.toLowerCase()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Application Status</label>
                                <p className="text-lg text-gray-900 capitalize">{applicant.status.toLowerCase().replace('_', ' ')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Date Applied</label>
                                <p className="text-lg text-gray-900">{applicant.createdAt.toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                <p className="text-lg text-gray-900">{applicant.updatedAt.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Card */}
                    {applicant.personalInfo && applicant.personalInfo !== "Submitted via online registration" && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{applicant.personalInfo}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Quick Actions & Timeline */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link
                                href={`/admin/applicants/${applicant.id}/approve`}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Approve Application
                            </Link>
                            <Link
                                href={`/admin/applicants/${applicant.id}/reject`}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Reject Application
                            </Link>
                            <Link
                                href="/admin/applicants"
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Back to List
                            </Link>
                        </div>
                    </div>

                    {/* Application Timeline */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                                    <p className="text-sm text-gray-500">{applicant.createdAt.toLocaleDateString()}</p>
                                </div>
                            </div>

                            {applicant.status !== "PENDING" && (
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Status Updated</p>
                                        <p className="text-sm text-gray-500 capitalize">{applicant.status.toLowerCase()}</p>
                                        <p className="text-sm text-gray-500">{applicant.updatedAt.toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Account Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Account</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-500">Account Created:</span>
                                <span className="ml-2 text-gray-900">{applicant.user.createdAt.toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">User Role:</span>
                                <span className="ml-2 text-gray-900 capitalize">{applicant.user.role.toLowerCase()}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">User ID:</span>
                                <span className="ml-2 font-mono text-gray-900 text-xs">{applicant.user.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}