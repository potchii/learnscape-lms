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

        await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                middleName, // optional
                lastName,
                gender,
                birthdate: new Date(birthdate || "2000-01-01"),
                address: address || "N/A",
                phoneNumber: phoneNumber || null,
                role: "APPLICANT", // default role
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
