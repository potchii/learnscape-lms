// src/app/api/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';

export async function POST(request: NextRequest) {
    try {
        const session = await getCurrentSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role !== 'TEACHER') {
            return NextResponse.json({ error: 'Teacher access required' }, { status: 403 });
        }

        const { title, description, type, url, classId } = await request.json();

        // Verify the teacher has access to this class
        const classData = await prisma.class.findFirst({
            where: {
                id: classId,
                teacher: {
                    userId: session.user.id,
                },
            },
            include: {
                teacher: true,
            },
        });

        if (!classData) {
            return NextResponse.json({ error: 'Class not found or access denied' }, { status: 403 });
        }

        // Create learning material
        const material = await prisma.learningMaterial.create({
            data: {
                title,
                description,
                type,
                url,
                classId,
                teacherId: classData.teacher.id,
            },
        });

        return NextResponse.json({ success: true, material });
    } catch (error) {
        console.error('Error creating material:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}