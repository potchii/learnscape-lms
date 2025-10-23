// src/app/student/dashboard/quizzes/[id]/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Calendar,
    FileText,
    AlertTriangle
} from "lucide-react";
import { QuizStartForm } from "@/components/student/quizzes/QuizStartForm";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function QuizPage({ params }: PageProps) {
    const session = await requireSession(["STUDENT"]);
    const quizId = params.id;

    // Get quiz details
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
            status: "PUBLISHED"
        },
        include: {
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
            },
            questions: {
                orderBy: { order: 'asc' },
                include: {
                    QuizAnswer: {
                        where: {
                            attempt: {
                                studentId: session.user.id
                            }
                        }
                    }
                }
            },
            attempts: {
                where: {
                    studentId: session.user.id,
                    submittedAt: { not: null }
                },
                orderBy: { startedAt: 'desc' }
            },
            _count: {
                select: {
                    questions: true
                }
            }
        }
    });

    if (!quiz) {
        notFound();
    }

    const student = await prisma.student.findUnique({
        where: { userId: session.user.id }
    });

    if (!student) {
        notFound();
    }

    // Check if quiz is still available
    const now = new Date();
    const dueDate = new Date(quiz.dueDate);
    const isOverdue = now > dueDate;
    const hasSubmittedAttempt = quiz.attempts.length > 0;
    const maxAttemptsReached = quiz.attempts.length >= quiz.maxAttempts;

    if (isOverdue || hasSubmittedAttempt || maxAttemptsReached) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/student/dashboard/quizzes">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Quizzes
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                        <p className="text-gray-600">{quiz.class.subjectName}</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            {isOverdue && (
                                <>
                                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Closed</h3>
                                    <p className="text-gray-600 mb-4">
                                        The due date for this quiz has passed.
                                    </p>
                                </>
                            )}
                            {hasSubmittedAttempt && (
                                <>
                                    <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Completed</h3>
                                    <p className="text-gray-600 mb-4">
                                        You have already submitted this quiz.
                                    </p>
                                    <Button asChild>
                                        <Link href={`/student/dashboard/quizzes/${quiz.id}/results`}>
                                            View Results
                                        </Link>
                                    </Button>
                                </>
                            )}
                            {maxAttemptsReached && !hasSubmittedAttempt && (
                                <>
                                    <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Maximum Attempts Reached</h3>
                                    <p className="text-gray-600 mb-4">
                                        You have reached the maximum number of attempts for this quiz.
                                    </p>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quiz Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="font-medium text-gray-500">Description</label>
                                <p className="mt-1">{quiz.description || "No description provided."}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-500">Teacher</label>
                                <p className="mt-1">{quiz.class.teacher.user.firstName} {quiz.class.teacher.user.lastName}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-500">Time Limit</label>
                                <p className="mt-1 flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{quiz.timeLimit} minutes</span>
                                </p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-500">Due Date</label>
                                <p className="mt-1 flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(quiz.dueDate).toLocaleDateString()}</span>
                                </p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-500">Questions</label>
                                <p className="mt-1 flex items-center space-x-1">
                                    <FileText className="h-4 w-4" />
                                    <span>{quiz._count.questions} questions</span>
                                </p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-500">Max Score</label>
                                <p className="mt-1">{quiz.maxScore} points</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button asChild variant="outline" size="sm">
                    <Link href="/student/dashboard/quizzes">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Quizzes
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                    <p className="text-gray-600">{quiz.class.subjectName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quiz Info */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Quiz Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="mt-1 text-sm">{quiz.description || "No description provided."}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Teacher</span>
                                <span className="text-sm font-medium">{quiz.class.teacher.user.firstName} {quiz.class.teacher.user.lastName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Time Limit</span>
                                <span className="text-sm font-medium flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{quiz.timeLimit} minutes</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Questions</span>
                                <span className="text-sm font-medium">{quiz._count.questions}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Max Score</span>
                                <span className="text-sm font-medium">{quiz.maxScore}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Due Date</span>
                                <span className="text-sm font-medium">{new Date(quiz.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <Badge variant="outline" className="w-full justify-center py-2">
                                Ready to Start
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Start Quiz Form */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Start Quiz</CardTitle>
                        <CardDescription>
                            Read the instructions carefully before starting
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <QuizStartForm
                            quiz={quiz}
                            studentId={student.id}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}