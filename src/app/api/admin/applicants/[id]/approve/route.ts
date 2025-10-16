import { NextRequest, NextResponse } from "next/server";
import { generateHumanId } from "@/lib/idGenerator";
import prisma from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const applicantId = params.id;
        const { parentId, sectionId } = await request.json();

        if (!parentId || !sectionId) {
            return NextResponse.json(
                { error: "Parent ID and Section ID are required" },
                { status: 400 }
            );
        }

        // Generate student ID OUTSIDE the transaction to reduce transaction time
        const studentNumber = await generateHumanId("STUDENT");

        const result = await prisma.$transaction(async (tx) => {
            const applicant = await tx.applicant.findUnique({
                where: { id: applicantId },
                include: { user: true },
            });


            if (!applicant) {
                throw new Error("Applicant not found");
            }

            if (applicant.status === "APPROVED") {
                throw new Error("Applicant already approved");
            }

            // Update user role
            await tx.user.update({
                where: { id: applicant.userId },
                data: { role: "STUDENT" },
            });

            // Create Student record (studentNumber already generated)
            const student = await tx.student.create({
                data: {
                    userId: applicant.userId,
                    parentId: parentId,
                    sectionId: sectionId,
                    studentNumber: studentNumber, // Use pre-generated ID
                },
                include: {
                    user: true,
                    parent: true,
                    section: true,
                },
            });

            // Update applicant status
            await tx.applicant.update({
                where: { id: applicantId },
                data: {
                    status: "APPROVED",
                },
            });

            return { student };
        }, {
            // Optional: Add transaction timeout override
            maxWait: 10000,
            timeout: 30000,
        });

        return NextResponse.json({
            message: "Applicant approved successfully",
            student: {
                id: result.student.id,
                studentNumber: result.student.studentNumber,
                name: `${result.student.user.firstName} ${result.student.user.lastName}`,
                section: result.student.section.name,
            },
        });

    } catch (error: any) {
        console.error("Error approving applicant:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}