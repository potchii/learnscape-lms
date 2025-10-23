// src/app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHumanId } from "@/lib/idGenerator";

// Import bcryptjs instead of bcrypt for better compatibility
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
        } = await req.json();

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

        // Generate applicant number if role is APPLICANT
        let applicantNumber;
        if (role === "APPLICANT") {
            applicantNumber = await generateHumanId("APPLICANT");
        }

        // Create user
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
                ...(role === "APPLICANT" && {
                    applicant: {
                        create: {
                            applicantNumber,
                            referenceCode: `REF-${applicantNumber}`,
                            status: "PENDING",
                            type: "NEW",
                        },
                    },
                }),
            },
            include: {
                applicant: role === "APPLICANT",
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
                    ...(user.applicant && {
                        applicantNumber: user.applicant.applicantNumber,
                        referenceCode: user.applicant.referenceCode,
                    }),
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}