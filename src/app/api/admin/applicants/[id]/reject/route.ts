import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireSession("ADMIN"); // This handles auth and redirects if not admin
        const applicantId = params.id;
        const { reason } = await request.json();

        if (!reason?.trim()) {
            return NextResponse.json(
                { error: "Rejection reason is required" },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch the applicant
            const applicant = await tx.applicant.findUnique({
                where: { id: applicantId },
                include: { user: true },
            });

            if (!applicant) {
                throw new Error("Applicant not found");
            }

            if (applicant.status !== "PENDING") {
                throw new Error(`Applicant already ${applicant.status.toLowerCase()}`);
            }

            // 2. Update applicant status to REJECTED
            const updatedApplicant = await tx.applicant.update({
                where: { id: applicantId },
                data: {
                    status: "REJECTED",
                    personalInfo: reason, // Store rejection reason in personalInfo field
                },
                include: {
                    user: true,
                },
            });

            return { applicant: updatedApplicant };
        });

        return NextResponse.json({
            message: "Applicant rejected successfully",
            applicant: {
                id: result.applicant.id,
                applicantNumber: result.applicant.applicantNumber,
                name: `${result.applicant.user.firstName} ${result.applicant.user.lastName}`,
                status: result.applicant.status,
            },
        });

    } catch (error: any) {
        console.error("Error rejecting applicant:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}