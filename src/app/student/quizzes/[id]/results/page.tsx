import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    BarChart3,
    Clock,
    BookOpen
} from "lucide-react";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function QuizResultsPage({ params }: PageProps) {
    const session = await requireSession(['STUDENT']);
    const quizId = params.id;

    // Get the latest submitted attempt for this quiz with proper includes
    const latestAttempt = await prisma.quizAttempt.findFirst({
        where: {
            quizId,
            studentId: session.user.id,
            submittedAt: { not: null }
        },
        orderBy: {
            submittedAt: 'desc'
        },
        include: {
            quiz: {
                include: {
                    questions: {
                        orderBy: { order: 'asc' }
                    },
                    class: {
                        include: {
                            teacher: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true
                                        }
                                    }
                                }
                            }
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

    if (!latestAttempt) {
        notFound();
    }

    // Calculate stats safely
    const correctAnswers = latestAttempt.answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = latestAttempt.quiz.questions.length;
    const score = latestAttempt.score || 0;
    const maxScore = latestAttempt.quiz.maxScore;
    const scorePercentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/student/quizzes">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Quizzes
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Quiz Results</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{latestAttempt.quiz.title}</CardTitle>
                        <CardDescription>
                            {latestAttempt.quiz.description}
                        </CardDescription>
                        <CardDescription>
                            Submitted on {latestAttempt.submittedAt?.toLocaleDateString()} at{" "}
                            {latestAttempt.submittedAt?.toLocaleTimeString()}
                            {latestAttempt.timeSpent && (
                                <> • Time spent: {Math.floor(latestAttempt.timeSpent / 60)}m {latestAttempt.timeSpent % 60}s</>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Score Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {score}/{maxScore}
                                    </div>
                                    <p className="text-sm text-gray-600">Score</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl font-bold text-green-600">
                                        {correctAnswers}/{totalQuestions}
                                    </div>
                                    <p className="text-sm text-gray-600">Correct Answers</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl font-bold text-purple-600">
                                        {scorePercentage.toFixed(1)}%
                                    </div>
                                    <p className="text-sm text-gray-600">Percentage</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Performance Badge */}
                        <div className="text-center">
                            <Badge
                                variant={
                                    scorePercentage >= 80 ? "default" :
                                        scorePercentage >= 60 ? "secondary" :
                                            "destructive"
                                }
                                className="text-lg py-2 px-4"
                            >
                                {scorePercentage >= 80 ? "Excellent" :
                                    scorePercentage >= 60 ? "Good" :
                                        "Needs Improvement"}
                            </Badge>
                        </div>

                        {/* Question Review */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Question Review</h3>
                            {latestAttempt.quiz.questions.map((question, index) => {
                                const answer = latestAttempt.answers.find(a => a.questionId === question.id);
                                const isCorrect = answer?.isCorrect || false;

                                return (
                                    <Card key={question.id} className={
                                        isCorrect ? "border-green-200" : "border-red-200"
                                    }>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">
                                                        Question {index + 1}
                                                    </span>
                                                    <Badge variant={isCorrect ? "default" : "destructive"}>
                                                        {isCorrect ? "Correct" : "Incorrect"}
                                                    </Badge>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {question.points} point{question.points !== 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            <p className="mb-4 font-medium">{question.questionText}</p>

                                            {question.type === 'MULTIPLE_CHOICE' && (
                                                <div className="space-y-2">
                                                    {(question.options as any[]).map((option: any) => (
                                                        <div
                                                            key={option.id}
                                                            className={`p-3 rounded border ${option.isCorrect
                                                                    ? "bg-green-50 border-green-200 font-medium"
                                                                    : answer?.selectedOption === option.id
                                                                        ? "bg-red-50 border-red-200"
                                                                        : "bg-gray-50 border-gray-200"
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span>{option.text}</span>
                                                                {option.isCorrect && (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                                )}
                                                                {!option.isCorrect && answer?.selectedOption === option.id && (
                                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {question.type === 'TRUE_FALSE' && (
                                                <div className="space-y-2">
                                                    {['True', 'False'].map((option, idx) => {
                                                        const isCorrectOption = (option === 'True' && (question.options as any[]).find((opt: any) => opt.isCorrect)?.text === 'True') ||
                                                            (option === 'False' && (question.options as any[]).find((opt: any) => opt.isCorrect)?.text === 'False');
                                                        const isSelected = answer?.selectedOption === option.toLowerCase();

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`p-3 rounded border ${isCorrectOption
                                                                        ? "bg-green-50 border-green-200 font-medium"
                                                                        : isSelected
                                                                            ? "bg-red-50 border-red-200"
                                                                            : "bg-gray-50 border-gray-200"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span>{option}</span>
                                                                    {isCorrectOption && (
                                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                                    )}
                                                                    {!isCorrectOption && isSelected && (
                                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {question.type === 'SHORT_ANSWER' && (
                                                <div className="space-y-3">
                                                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                                        <p className="text-sm font-medium text-blue-900 mb-1">Your Answer:</p>
                                                        <p>{answer?.answerText || "No answer provided"}</p>
                                                    </div>
                                                    {!isCorrect && (
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                                            <p className="text-sm font-medium text-yellow-900">
                                                                This question requires manual grading by your teacher.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {answer && answer.points !== null && answer.points !== undefined && (
                                                <div className="mt-3 text-sm text-gray-600">
                                                    You scored {answer.points} point{answer.points !== 1 ? 's' : ''} for this question
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center pt-4">
                            <Link href="/student/quizzes">
                                <Button variant="outline">
                                    Back to Quizzes
                                </Button>
                            </Link>
                            {latestAttempt.quiz.class && (
                                <Link href={`/student/classes/${latestAttempt.quiz.class.id}`}>
                                    <Button>
                                        Return to Class
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}