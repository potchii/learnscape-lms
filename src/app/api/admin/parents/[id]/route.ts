import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireSession("ADMIN");

        const parent = await prisma.parent.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        address: true,
                        createdAt: true,
                    },
                },
                students: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        section: {
                            select: {
                                id: true,
                                name: true,
                                gradeLevel: true,
                            },
                        },
                    },
                    orderBy: {
                        user: {
                            firstName: 'asc',
                        },
                    },
                },
                alerts: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5,
                },
            },
        });

        if (!parent) {
            return NextResponse.json({ error: "Parent not found" }, { status: 404 });
        }

        return NextResponse.json(parent);
    } catch (error: any) {
        console.error("Error fetching parent:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}