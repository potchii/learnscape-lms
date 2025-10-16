import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RejectApplicantForm } from "./reject-form";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function RejectApplicantPage({ params }: PageProps) {
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

    if (applicant.status !== "PENDING") {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-yellow-800">Application Already Processed</h2>
                    <p className="text-yellow-700">
                        This application has already been {applicant.status.toLowerCase()}.
                        <a href="/admin/applicants" className="text-blue-600 hover:text-blue-800 ml-1">
                            Return to applicants list
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Reject Applicant</h1>
                <p className="text-gray-600">Review and reject this student application</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Applicant Summary */}
                <div className="mb-6 p-4 bg-red-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Applicant Information</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Name:</span> {applicant.user.firstName} {applicant.user.lastName}
                        </div>
                        <div>
                            <span className="font-medium">Email:</span> {applicant.user.email}
                        </div>
                        <div>
                            <span className="font-medium">Applicant ID:</span> {applicant.applicantNumber}
                        </div>
                        <div>
                            <span className="font-medium">Reference:</span> {applicant.referenceCode}
                        </div>
                        <div>
                            <span className="font-medium">Type:</span> {applicant.type}
                        </div>
                        <div>
                            <span className="font-medium">Applied:</span> {applicant.createdAt.toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Warning Message */}
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <h3 className="font-medium text-red-800">Warning: This action cannot be undone</h3>
                            <p className="text-red-700 text-sm mt-1">
                                Rejecting this application will prevent the user from becoming a student.
                                They will remain as an APPLICANT but with REJECTED status.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rejection Form */}
                <RejectApplicantForm applicant={applicant} />
            </div>
        </div>
    );
}