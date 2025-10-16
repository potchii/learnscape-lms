import { NextResponse } from "next/server";
import { generateHumanId } from "@/lib/idGenerator";

export async function GET() {
    try {
        // Test generating IDs for all roles
        const [studentId, parentId, teacherId] = await Promise.all([
            generateHumanId("STUDENT"),
            generateHumanId("PARENT"),
            generateHumanId("TEACHER"),
        ]);

        return NextResponse.json({
            success: true,
            generatedIds: {
                student: studentId,
                parent: parentId,
                teacher: teacherId,
            },
            expectedFormat: {
                student: "BFPS-2025-0001",
                parent: "P-2025-0001",
                teacher: "EMP-2025-0001"
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("ID Generation Test Failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}