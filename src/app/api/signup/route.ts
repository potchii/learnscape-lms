import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateHumanId } from "@/lib/idGenerator";

export async function POST(req: Request) {
    try {
        const { email, password, firstName, middleName, lastName, gender, birthdate, address, phoneNumber } = await req.json();

        if (!["MALE", "FEMALE"].includes(gender)) {
            return NextResponse.json({ error: "Invalid gender value" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Generate unique reference code and applicant number
        const referenceCode = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const applicantNumber = await generateHumanId("APPLICANT"); // GENERATE APPLICANT ID

        // Use transaction to create both User and Applicant records
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create User with APPLICANT role
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    firstName,
                    middleName,
                    lastName,
                    gender,
                    birthdate: new Date(birthdate || "2000-01-01"),
                    address: address || "N/A",
                    phoneNumber: phoneNumber || null,
                    role: "APPLICANT",
                },
            });

            // 2. Create corresponding Applicant record WITH APPLICANT NUMBER
            const applicant = await tx.applicant.create({
                data: {
                    userId: user.id,
                    type: "NEW",
                    status: "PENDING",
                    applicantNumber: applicantNumber, // 👈 STORE GENERATED ID
                    referenceCode: referenceCode,
                    personalInfo: "Submitted via online registration",
                },
            });

            return { user, applicant };
        });

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            applicantNumber: applicantNumber, // 👈 RETURN BOTH
            referenceCode: referenceCode
        }, { status: 201 });

    } catch (err) {
        console.error("Signup error details:", err);
        console.error("Error stack:", err instanceof Error ? err.stack : 'No stack');
        return NextResponse.json({
            error: "Internal server error",
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 });
    }
}