// src/app/api/quizzes/route.ts
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

        const {
            title,
            description,
            dueDate,
            timeLimit,
            maxAttempts,
            maxScore,
            questions,
            classId
        } = await request.json();

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

        // Validate questions
        if (!questions || questions.length === 0) {
            return NextResponse.json({ error: 'At least one question is required' }, { status: 400 });
        }

        // Create quiz with questions
        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                timeLimit,
                maxAttempts,
                maxScore,
                classId,
                teacherId: classData.teacher.id,
                status: 'PUBLISHED',
                questions: {
                    create: questions.map((q: any, index: number) => ({
                        order: index + 1,
                        questionText: q.questionText,
                        type: q.type,
                        points: q.points,
                        options: q.options,
                    })),
                },
            },
            include: {
                questions: true,
            },
        });

        return NextResponse.json({ success: true, quiz });
    } catch (error) {
        console.error('Error creating quiz:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}