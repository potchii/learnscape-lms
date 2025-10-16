import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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

        // Generate unique reference code for the applicant
        const referenceCode = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

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

            // 2. Create corresponding Applicant record
            const applicant = await tx.applicant.create({
                data: {
                    userId: user.id,
                    type: "NEW", // Default to NEW applicant
                    status: "PENDING", // Default status
                    referenceCode: referenceCode,
                    personalInfo: "Submitted via online registration", // Default info
                },
            });

            return { user, applicant };
        });

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            referenceCode: referenceCode // Send back for user reference
        }, { status: 201 });

    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}