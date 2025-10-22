import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { AlertService } from "@/lib/alert-service";

export async function GET(request: NextRequest) {
    try {
        const session = await requireSession(['PARENT']);

        const parent = await requireSession(['PARENT']);
        const alerts = await AlertService.getParentAlerts(parent.id);

        return NextResponse.json({ alerts });
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
        const { action, alertId } = await request.json();

        if (action === 'mark-viewed' && alertId) {
            await AlertService.markAlertAsViewed(alertId);
            return NextResponse.json({ success: true });
        }

        if (action === 'mark-all-viewed') {
            const parent = await requireSession(['PARENT']);
            await AlertService.markAllAlertsAsViewed(parent.id);
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