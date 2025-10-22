// src/app/api/grades/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';

export async function POST(request: NextRequest) {
    try {
        const session = await getCurrentSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify the user is a teacher
        if (session.user.role !== 'TEACHER') {
            return NextResponse.json({ error: 'Teacher access required' }, { status: 403 });
        }

        const { classId, assignmentId, grades } = await request.json();

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

        // Update or create grades
        const updatePromises = grades.map(async (gradeData: any) => {
            const existingGrade = await prisma.grade.findFirst({
                where: {
                    studentId: gradeData.studentId,
                    assignmentId: assignmentId,
                    classId: classId,
                },
            });

            if (existingGrade) {
                // Update existing grade
                return prisma.grade.update({
                    where: { id: existingGrade.id },
                    data: {
                        score: parseFloat(gradeData.score),
                        remarks: gradeData.remarks,
                        gradedAt: new Date(),
                    },
                });
            } else {
                // Create new grade
                return prisma.grade.create({
                    data: {
                        studentId: gradeData.studentId,
                        classId: classId,
                        assignmentId: assignmentId,
                        teacherId: classData.teacherId,
                        score: parseFloat(gradeData.score),
                        remarks: gradeData.remarks,
                        gradedAt: new Date(),
                    },
                });
            }
        });

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating grades:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}