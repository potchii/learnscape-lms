// src/lib/idGenerator.ts
import prisma from "@/lib/prisma";

type IdType = "STUDENT" | "PARENT" | "TEACHER" | "APPLICANT"; // 👈 ADDED APPLICANT

function formatId(prefix: string, year: number, number: number): string {
    return `${prefix}-${year}-${number.toString().padStart(4, "0")}`;
}

export async function generateHumanId(type: IdType): Promise<string> {
    const currentYear = new Date().getFullYear();

    // Fetch or create a counter
    const counter = await prisma.idCounter.upsert({
        where: {
            type_year: {
                type,
                year: currentYear
            }
        },
        update: {
            lastNumber: { increment: 1 }
        },
        create: {
            type,
            year: currentYear,
            lastNumber: 1
        },
    });

    const nextNumber = counter.lastNumber;

    // Prefix based on role type - ADDED APPLICANT
    const prefixMap = {
        STUDENT: "BFPS",
        TEACHER: "EMP",
        PARENT: "P",
        APPLICANT: "APP", // 👈 NEW PREFIX
    };

    return formatId(prefixMap[type], currentYear, nextNumber);
}