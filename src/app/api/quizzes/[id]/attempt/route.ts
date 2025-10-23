import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log("🔍 [API] Starting quiz attempt endpoint hit");
        const session = await requireSession(['STUDENT']);
        const quizId = params.id;

        console.log("🔍 [API] Quiz ID:", quizId, "User ID:", session.user.id);

        // First, get the student record for this user
        const student = await prisma.student.findFirst({
            where: {
                userId: session.user.id
            }
        });

        console.log("🔍 [API] Student record found:", !!student);

        if (!student) {
            console.log("❌ [API] Student record not found for user:", session.user.id);
            return NextResponse.json(
                { error: "Student record not found. Please contact administrator." },
                { status: 404 }
            );
        }

        console.log("🔍 [API] Student ID:", student.id);

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

        console.log("🔍 [API] Quiz found:", !!quiz);

        if (!quiz) {
            console.log("❌ [API] Quiz not found or not published:", quizId);
            return NextResponse.json(
                { error: "Quiz not found or not available" },
                { status: 404 }
            );
        }

        // Check existing attempts - using student.id instead of session.user.id
        const existingAttempts = await prisma.quizAttempt.findMany({
            where: {
                quizId,
                studentId: student.id
            }
        });

        console.log("📊 [API] Existing attempts:", existingAttempts.length, "Max attempts:", quiz.maxAttempts);

        if (existingAttempts.length >= quiz.maxAttempts) {
            return NextResponse.json(
                { error: "Maximum attempts reached" },
                { status: 400 }
            );
        }

        // Check if there's an existing in-progress attempt
        const existingInProgress = existingAttempts.find(attempt => !attempt.submittedAt);
        if (existingInProgress) {
            console.log("🔄 [API] Returning existing in-progress attempt:", existingInProgress.id);

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

        console.log("🔄 [API] Creating new attempt...");

        // Create new attempt - using student.id instead of session.user.id
        const attempt = await prisma.quizAttempt.create({
            data: {
                quizId,
                studentId: student.id, // ← FIXED: Use student.id, not session.user.id
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

        console.log("✅ [API] Created new attempt:", attempt.id);

        return NextResponse.json(attempt);
    } catch (error) {
        console.error("❌ [API] Error starting quiz:", error);

        // More detailed error logging
        if (error instanceof Error) {
            console.error("❌ [API] Error name:", error.name);
            console.error("❌ [API] Error message:", error.message);
            console.error("❌ [API] Error stack:", error.stack);
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}