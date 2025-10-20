"use server";

import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function markAnnouncementAsRead(announcementId: string) {
    try {
        const session = await requireSession(["STUDENT", "ADMIN"]);

        await prisma.announcementView.upsert({
            where: {
                announcementId_userId: {
                    announcementId,
                    userId: session.user.id,
                },
            },
            update: {},
            create: {
                announcementId,
                userId: session.user.id,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error marking announcement as read:', error);
        return { success: false, error: 'Failed to mark as read' };
    }
}