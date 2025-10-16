import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function ApplicantPortalPage() {
    const session = await requireSession(["APPLICANT", "ADMIN"]);

    const applicant = await prisma.applicant.findUnique({
        where: { userId: session.user.id },
        include: { user: true }
    });

    if (!applicant) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Application Not Found</h2>
                    <p className="text-red-600">We couldn't find your application. Please contact support.</p>
                </div>
            </div>
        );
    }

    const statusConfig = {
        PENDING: {
            color: "bg-yellow-100 text-yellow-800",
            label: "Pending Review",
            message: "Your application has been received and is awaiting review."
        },
        UNDER_REVIEW: {
            color: "bg-blue-100 text-blue-800",
            label: "Under Review",
            message: "Your application is currently being reviewed by our admissions team."
        },
        APPROVED: {
            color: "bg-green-100 text-green-800",
            label: "Approved",
            message: "Congratulations! Your application has been approved. You will receive your student credentials shortly."
        },
        REJECTED: {
            color: "bg-red-100 text-red-800",
            label: "Rejected",
            message: "We're sorry, your application has not been approved at this time."
        },
        WAITLISTED: {
            color: "bg-purple-100 text-purple-800",
            label: "Waitlisted",
            message: "Your application is on our waitlist. We will contact you if a spot becomes available."
        },
    };

    const statusInfo = statusConfig[applicant.status];

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Application Portal</h1>
                <p className="text-gray-600">Track your admission application status</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Application Status</h2>
                    <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                    </div>
                    <p className="mt-2 text-gray-600">{statusInfo.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Applicant Information</h3>
                            <p className="text-lg mt-1">{applicant.user.firstName} {applicant.user.lastName}</p>
                            <p className="text-gray-600">{applicant.user.email}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Reference Code</h3>
                            <p className="text-lg font-mono text-blue-600 mt-1">{applicant.referenceCode}</p>
                            <p className="text-sm text-gray-500">Keep this for your records</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Application Type</h3>
                            <p className="text-lg mt-1 capitalize">{applicant.type.toLowerCase().replace('_', ' ')}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Timeline</h3>
                            <div className="mt-1 space-y-1">
                                <p className="text-sm">
                                    <span className="font-medium">Submitted:</span> {applicant.createdAt.toLocaleDateString()}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Last Updated:</span> {applicant.updatedAt.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
                <p className="text-blue-700 text-sm">
                    If you have questions about your application, please contact the admissions office at
                    <span className="font-medium"> admissions@brightfield.edu</span> or call
                    <span className="font-medium"> (555) 123-4567</span>.
                </p>
            </div>
        </div>
    );
}