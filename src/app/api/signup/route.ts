// src/app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHumanId } from "@/lib/idGenerator";
import bcryptjs from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const {
            email,
            password,
            firstName,
            middleName,
            lastName,
            gender,
            birthdate,
            address,
            phoneNumber,
            role,
            personalInfo,
        } = await req.json();

        console.log('Received signup data:', {
            email,
            firstName,
            lastName,
            role,
            personalInfo
        });

        // Validate required fields
        if (!email || !password || !firstName || !lastName || !gender || !birthdate || !address) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcryptjs.hash(password, 12);

        // Handle APPLICANT role differently
        if (role === "APPLICANT") {
            // Generate applicant number
            const applicantNumber = await generateHumanId("APPLICANT");

            // Create user with applicant in a single transaction
            const result = await prisma.$transaction(async (tx) => {
                // First create the user
                const user = await tx.user.create({
                    data: {
                        email,
                        passwordHash,
                        firstName,
                        middleName,
                        lastName,
                        gender,
                        birthdate: new Date(birthdate),
                        address,
                        phoneNumber,
                        role,
                    },
                });

                // Then create the applicant record
                const applicant = await tx.applicant.create({
                    data: {
                        userId: user.id,
                        applicantNumber,
                        referenceCode: `REF-${applicantNumber}`,
                        status: "PENDING",
                        type: "NEW",
                        personalInfo: personalInfo,
                    },
                });

                return { user, applicant };
            });

            console.log('Created applicant:', result);

            return NextResponse.json(
                {
                    message: "Applicant created successfully",
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        firstName: result.user.firstName,
                        lastName: result.user.lastName,
                        role: result.user.role,
                        applicantNumber: result.applicant.applicantNumber,
                        referenceCode: result.applicant.referenceCode,
                    }
                },
                { status: 201 }
            );
        } else {
            // Handle other roles (though currently only APPLICANT is allowed)
            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    firstName,
                    middleName,
                    lastName,
                    gender,
                    birthdate: new Date(birthdate),
                    address,
                    phoneNumber,
                    role,
                },
            });

            return NextResponse.json(
                {
                    message: "User created successfully",
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                    }
                },
                { status: 201 }
            );
        }

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}