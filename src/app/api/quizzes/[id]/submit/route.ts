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
        const { attemptId, answers, timeSpent } = await request.json();

        // Verify attempt belongs to student
        const attempt = await prisma.quizAttempt.findFirst({
            where: {
                id: attemptId,
                quizId,
                studentId: session.user.id,
                submittedAt: null // Only allow submission if not already submitted
            },
            include: {
                quiz: {
                    include: {
                        questions: true
                    }
                }
            }
        });

        if (!attempt) {
            return NextResponse.json(
                { error: "Invalid attempt" },
                { status: 400 }
            );
        }

        // Calculate score
        let totalScore = 0;
        const answerPromises = answers.map(async (answer: any) => {
            const question = attempt.quiz.questions.find(q => q.id === answer.questionId);
            if (!question) return;

            let isCorrect = false;
            let points = 0;

            if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
                const options = question.options as any[];
                const correctOption = options.find(opt => opt.isCorrect);
                isCorrect = correctOption && answer.selectedOption === correctOption.id;
                points = isCorrect ? question.points : 0;
            } else if (question.type === 'SHORT_ANSWER') {
                // For short answer, you might want manual grading
                points = 0; // Auto-grade later or manually
            }

            totalScore += points;

            return prisma.quizAnswer.create({
                data: {
                    attemptId,
                    questionId: answer.questionId,
                    selectedOption: answer.selectedOption,
                    answerText: answer.answerText,
                    isCorrect,
                    points
                }
            });
        });

        await Promise.all(answerPromises);

        // Update attempt with score and submission time
        const updatedAttempt = await prisma.quizAttempt.update({
            where: { id: attemptId },
            data: {
                score: totalScore,
                submittedAt: new Date(),
                timeSpent
            },
            include: {
                answers: {
                    include: {
                        question: true
                    }
                }
            }
        });

        return NextResponse.json(updatedAttempt);
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}