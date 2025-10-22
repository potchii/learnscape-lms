// src/app/api/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';

// GET handler to fetch attendance for a specific date
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
        const date = searchParams.get('date');

        if (!classId || !date) {
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

        const selectedDate = new Date(date);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Fetch attendance for the specific date
        const attendance = await prisma.attendance.findMany({
            where: {
                classId,
                date: {
                    gte: selectedDate,
                    lt: nextDate,
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
        });

        return NextResponse.json({
            success: true,
            attendance,
            totalRecords: attendance.length
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST handler to save attendance (updated to handle custom dates)
export async function POST(request: NextRequest) {
    try {
        const session = await getCurrentSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role !== 'TEACHER') {
            return NextResponse.json({ error: 'Teacher access required' }, { status: 403 });
        }

        const { classId, teacherId, date, attendance } = await request.json();

        // Verify the teacher has access to this class
        const classData = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: teacherId,
            },
        });

        if (!classData) {
            return NextResponse.json({ error: 'Class not found or access denied' }, { status: 403 });
        }

        const selectedDate = new Date(date);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Create or update attendance records
        const attendancePromises = attendance.map(async (att: any) => {
            const existingAttendance = await prisma.attendance.findFirst({
                where: {
                    studentId: att.studentId,
                    classId,
                    date: {
                        gte: selectedDate,
                        lt: nextDate,
                    },
                },
            });

            if (existingAttendance) {
                // Update existing attendance
                return prisma.attendance.update({
                    where: { id: existingAttendance.id },
                    data: {
                        status: att.status,
                    },
                });
            } else {
                // Create new attendance record
                return prisma.attendance.create({
                    data: {
                        studentId: att.studentId,
                        classId,
                        teacherId,
                        date: selectedDate,
                        status: att.status,
                    },
                });
            }
        });

        await Promise.all(attendancePromises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving attendance:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}