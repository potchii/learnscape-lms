import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ApproveApplicantForm } from "./approve-form";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ApproveApplicantPage({ params }: PageProps) {
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

    // Fetch available parents and sections for assignment
    const [parents, sections] = await Promise.all([
        prisma.parent.findMany({
            include: {
                user: true,
                students: true,
            },
        }),
        prisma.section.findMany({
            include: {
                students: true,
            },
        }),
    ]);

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Approve Applicant</h1>
                <p className="text-gray-600">Review and approve this student application</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Applicant Summary */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Applicant Information</h2>
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

                {/* Approval Form */}
                <ApproveApplicantForm
                    applicant={applicant}
                    parents={parents}
                    sections={sections}
                />
            </div>
        </div>
    );
}