// src/app/api/parent/alerts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { AlertService } from "@/lib/alert-service";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await requireSession(["PARENT", "ADMIN"]);

        // Get parent record
        const parent = await prisma.parent.findFirst({
            where: { userId: session.user.id }
        });

        if (!parent) {
            return NextResponse.json({ error: "Parent not found" }, { status: 404 });
        }

        const alerts = await AlertService.getParentAlerts(parent.id);

        return NextResponse.json({ alerts });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        return NextResponse.json(
            { error: "Failed to fetch alerts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await requireSession(["PARENT", "ADMIN"]);
        const { action, alertId } = await request.json();

        const parent = await prisma.parent.findFirst({
            where: { userId: session.user.id }
        });

        if (!parent) {
            return NextResponse.json({ error: "Parent not found" }, { status: 404 });
        }

        if (action === "markAllViewed") {
            await AlertService.markAllAlertsAsViewed(parent.id);
            return NextResponse.json({ success: true });
        }

        if (action === "markViewed" && alertId) {
            await AlertService.markAlertAsViewed(alertId);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error updating alerts:", error);
        return NextResponse.json(
            { error: "Failed to update alerts" },
            { status: 500 }
        );
    }
}