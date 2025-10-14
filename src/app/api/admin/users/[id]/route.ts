import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { role } = await req.json();

        const updated = await prisma.user.update({
            where: { id: params.id },
            data: { role },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
