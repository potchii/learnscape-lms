import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; attemptId: string } }
) {
    try {
        const session = await requireSession(['STUDENT']);
        const { id: quizId, attemptId } = params;

        console.log("🔍 [ATTEMPT API] Fetching quiz attempt:", attemptId, "for quiz:", quizId);

        // First, get the student record for this user
        const student = await prisma.student.findFirst({
            where: {
                userId: session.user.id
            }
        });

        console.log("🔍 [ATTEMPT API] Student record found:", !!student);

        if (!student) {
            console.log("❌ [ATTEMPT API] Student record not found for user:", session.user.id);
            return NextResponse.json(
                { error: "Student record not found. Please contact administrator." },
                { status: 404 }
            );
        }

        console.log("🔍 [ATTEMPT API] Student ID:", student.id);

        const attempt = await prisma.quizAttempt.findFirst({
            where: {
                id: attemptId,
                quizId,
                studentId: student.id
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
                },
                answers: {
                    include: {
                        question: true
                    }
                }
            }
        });

        if (!attempt) {
            console.log("❌ [ATTEMPT API] Attempt not found:", attemptId);
            return NextResponse.json(
                { error: "Attempt not found" },
                { status: 404 }
            );
        }

        console.log("✅ [ATTEMPT API] Found attempt:", attempt.id, "Submitted:", !!attempt.submittedAt);
        console.log("✅ [ATTEMPT API] Quiz questions:", attempt.quiz.questions.length);

        return NextResponse.json(attempt);
    } catch (error) {
        console.error("❌ [ATTEMPT API] Error fetching quiz attempt:", error);

        if (error instanceof Error) {
            console.error("❌ [ATTEMPT API] Error details:", error.message);
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}