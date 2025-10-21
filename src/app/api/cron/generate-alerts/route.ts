// src/app/api/cron/generate-alerts/route.ts
import { NextResponse } from "next/server";
import { AlertService } from "@/lib/alert-service";

export async function GET(request: Request) {
    try {
        // This would be called by a cron service like Vercel Cron
        await AlertService.generateIncompleteTaskAlerts();

        return NextResponse.json({
            success: true,
            message: "Alerts generated successfully"
        });
    } catch (error) {
        console.error("Error generating alerts:", error);
        return NextResponse.json(
            { error: "Failed to generate alerts" },
            { status: 500 }
        );
    }
}