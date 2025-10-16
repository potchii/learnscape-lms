import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateHumanId } from "@/lib/idGenerator";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password, role, parentId, sectionId } = await req.json();

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !role) {
            return NextResponse.json(
                { error: "All basic fields are required" },
                { status: 400 }
            );
        }

        // Additional validation for STUDENT role
        if (role === "STUDENT" && (!parentId || !sectionId)) {
            return NextResponse.json(
                { error: "Parent and Section are required for STUDENT role" },
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
                { status: 400 }
            );
        }

        // For STUDENT role, verify parent and section exist BEFORE transaction
        if (role === "STUDENT") {
            const [parent, section] = await Promise.all([
                prisma.parent.findUnique({ where: { id: parentId } }),
                prisma.section.findUnique({ where: { id: sectionId } })
            ]);

            if (!parent) {
                return NextResponse.json({ error: "Selected parent not found" }, { status: 400 });
            }
            if (!section) {
                return NextResponse.json({ error: "Selected section not found" }, { status: 400 });
            }
        }

        // Generate IDs and hash password BEFORE transaction
        let generatedId = null;
        let referenceCode = null;

        if (["STUDENT", "PARENT", "TEACHER", "APPLICANT"].includes(role)) {
            generatedId = await generateHumanId(role as any);
        }

        if (role === "APPLICANT") {
            referenceCode = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // Now do the transaction with minimal async work
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the base User
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    firstName,
                    lastName,
                    gender: "MALE",
                    birthdate: new Date("2000-01-01"),
                    address: "Not specified",
                    role: role,
                },
            });

            let roleRecord = null;

            // 2. Create role-specific record (all sync operations now)
            switch (role) {
                case "STUDENT":
                    roleRecord = await tx.student.create({
                        data: {
                            userId: user.id,
                            studentNumber: generatedId!,
                            parentId: parentId!,
                            sectionId: sectionId!,
                        },
                    });
                    break;

                case "PARENT":
                    roleRecord = await tx.parent.create({
                        data: {
                            userId: user.id,
                            parentNumber: generatedId!,
                        },
                    });
                    break;

                case "TEACHER":
                    roleRecord = await tx.teacher.create({
                        data: {
                            userId: user.id,
                            employeeNumber: generatedId!,
                        },
                    });
                    break;

                case "APPLICANT":
                    roleRecord = await tx.applicant.create({
                        data: {
                            userId: user.id,
                            applicantNumber: generatedId!,
                            referenceCode: referenceCode!,
                            type: "NEW",
                            status: "PENDING",
                            personalInfo: "Created by admin",
                        },
                    });
                    break;

                case "ADMIN":
                    roleRecord = await tx.admin.create({
                        data: {
                            userId: user.id,
                        },
                    });
                    break;

                default:
                    throw new Error(`Unsupported role: ${role}`);
            }

            return { user, roleRecord };
        });

        // Prepare success response
        let successMessage = `User created successfully as ${role}`;
        if (generatedId) {
            successMessage += ` with ID: ${generatedId}`;
        }

        return NextResponse.json(
            {
                message: successMessage,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role,
                    generatedId: generatedId,
                }
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("User creation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}