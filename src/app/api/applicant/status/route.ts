import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Use your session helper - requires APPLICANT role
        const session = await requireSession("APPLICANT");

        const applicant = await prisma.applicant.findFirst({
            where: {
                user: {
                    email: session.user.email,
                },
            },
            include: {
                user: true,
            },
        });

        if (!applicant) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({
            status: applicant.status,
            referenceCode: applicant.referenceCode,
            type: applicant.type,
            createdAt: applicant.createdAt,
            updatedAt: applicant.updatedAt,
            user: {
                firstName: applicant.user.firstName,
                lastName: applicant.user.lastName,
                email: applicant.user.email,
            },
        });

    } catch (error) {
        console.error("Status check error:", error);

        // Handle redirect errors from requireSession
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}