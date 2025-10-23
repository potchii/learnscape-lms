import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireSession(['STUDENT']);
        const quizId = params.id;

        console.log("🔍 Starting quiz attempt for quiz:", quizId, "student:", session.user.id);

        // Check if quiz exists and is published
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId,
                status: 'PUBLISHED'
            },
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!quiz) {
            console.log("❌ Quiz not found or not published:", quizId);
            return NextResponse.json(
                { error: "Quiz not found or not available" },
                { status: 404 }
            );
        }

        // Check existing attempts
        const existingAttempts = await prisma.quizAttempt.findMany({
            where: {
                quizId,
                studentId: session.user.id
            }
        });

        console.log("📊 Existing attempts:", existingAttempts.length, "Max attempts:", quiz.maxAttempts);

        if (existingAttempts.length >= quiz.maxAttempts) {
            return NextResponse.json(
                { error: "Maximum attempts reached" },
                { status: 400 }
            );
        }

        // Check if there's an existing in-progress attempt
        const existingInProgress = existingAttempts.find(attempt => !attempt.submittedAt);
        if (existingInProgress) {
            console.log("🔄 Returning existing in-progress attempt:", existingInProgress.id);

            // Get the full quiz data for the existing attempt
            const attemptWithQuiz = await prisma.quizAttempt.findUnique({
                where: { id: existingInProgress.id },
                include: {
                    quiz: {
                        include: {
                            questions: {
                                orderBy: { order: 'asc' },
                                select: {
                                    id: true,
                                    order: true,
                                    questionText: true,
                                    type: true,
                                    points: true,
                                    options: true
                                }
                            }
                        }
                    }
                }
            });

            return NextResponse.json(attemptWithQuiz);
        }

        // Create new attempt
        const attempt = await prisma.quizAttempt.create({
            data: {
                quizId,
                studentId: session.user.id,
                startedAt: new Date()
            },
            include: {
                quiz: {
                    include: {
                        questions: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                order: true,
                                questionText: true,
                                type: true,
                                points: true,
                                options: true
                            }
                        }
                    }
                }
            }
        });

        console.log("✅ Created new attempt:", attempt.id);

        return NextResponse.json(attempt);
    } catch (error) {
        console.error("❌ Error starting quiz:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}