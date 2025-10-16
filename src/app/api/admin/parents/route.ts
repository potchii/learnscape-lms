import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        await requireSession("ADMIN");

        const parents = await prisma.parent.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                user: {
                    firstName: 'asc',
                },
            },
        });

        return NextResponse.json({ parents });
    } catch (error) {
        console.error("Error fetching parents:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}