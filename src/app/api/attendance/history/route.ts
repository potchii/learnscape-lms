// src/app/api/attendance/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';

export async function GET(request: NextRequest) {
    try {
        const session = await getCurrentSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role !== 'TEACHER') {
            return NextResponse.json({ error: 'Teacher access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const classId = searchParams.get('classId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!classId || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Verify the teacher has access to this class
        const classData = await prisma.class.findFirst({
            where: {
                id: classId,
                teacher: {
                    userId: session.user.id,
                },
            },
        });

        if (!classData) {
            return NextResponse.json({ error: 'Class not found or access denied' }, { status: 403 });
        }

        // Fetch attendance records for the date range
        const attendance = await prisma.attendance.findMany({
            where: {
                classId,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate + 'T23:59:59.999Z'), // Include the entire end date
                },
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json({
            success: true,
            attendance,
            totalRecords: attendance.length
        });
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}