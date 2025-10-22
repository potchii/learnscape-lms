import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await requireSession(['PARENT']);

        const parent = await prisma.parent.findUnique({
            where: { userId: session.user.id },
            include: {
                alerts: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                },
            },
        });

        if (!parent) {
            return NextResponse.json({ error: "Parent not found" }, { status: 404 });
        }

        return NextResponse.json({ alerts: parent.alerts });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await requireSession(['PARENT']);
        const { action, alertId, parentId } = await request.json();

        if (action === 'mark-viewed' && alertId) {
            await prisma.alert.update({
                where: { id: alertId },
                data: { viewed: true },
            });

            return NextResponse.json({ success: true });
        }

        if (action === 'mark-all-viewed' && parentId) {
            await prisma.alert.updateMany({
                where: {
                    parentId,
                    viewed: false,
                },
                data: { viewed: true },
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error updating alerts:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}