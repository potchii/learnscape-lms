import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    BookOpen,
    Clock,
    Calendar,
    CheckCircle2,
    PlayCircle,
    AlertCircle,
    BarChart3,
    FileText
} from "lucide-react";

export default async function StudentQuizzesPage() {
    const session = await requireSession(['STUDENT']);

    // Get student data with FIXED Prisma query
    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        include: {
            section: {
                include: {
                    classes: {
                        include: {
                            // Fix: Changed 'quizzes' to 'Quiz'
                            Quiz: {
                                where: {
                                    status: {
                                        in: ["PUBLISHED", "CLOSED"]
                                    }
                                },
                                include: {
                                    attempts: {
                                        where: {
                                            studentId: session.user.id
                                        },
                                        orderBy: {
                                            startedAt: "desc"
                                        }
                                    },
                                    _count: {
                                        select: {
                                            questions: true
                                        }
                                    }
                                },
                                orderBy: {
                                    dueDate: "asc"
                                }
                            },
                            section: true,
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
            }
        }
    });

    if (!student) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Student Not Found</h2>
                        <p className="text-gray-600 mb-4">Unable to find your student record.</p>
                        <Button asChild>
                            <Link href="/student/dashboard">Return to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Flatten all quizzes from all classes - FIXED: use 'Quiz' instead of 'quizzes'
    const allQuizzes = student.section.classes.flatMap(classItem =>
        (classItem.Quiz || []).map(quiz => ({
            ...quiz,
            class: classItem,
            studentAttempt: quiz.attempts[0] || null
        }))
    );

    // Sort quizzes by due date
    const sortedQuizzes = allQuizzes.sort((a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    // Categorize quizzes
    const upcomingQuizzes = sortedQuizzes.filter(quiz => {
        const now = new Date();
        const dueDate = new Date(quiz.dueDate);
        return dueDate > now && quiz.status === 'PUBLISHED';
    });

    const pastQuizzes = sortedQuizzes.filter(quiz => {
        const now = new Date();
        const dueDate = new Date(quiz.dueDate);
        return dueDate <= now || quiz.status === 'CLOSED';
    });

    const getQuizStatus = (quiz: any) => {
        const now = new Date();
        const dueDate = new Date(quiz.dueDate);

        if (quiz.studentAttempt?.submittedAt) {
            return 'completed';
        }

        if (quiz.studentAttempt && !quiz.studentAttempt.submittedAt) {
            return 'in-progress';
        }

        if (dueDate < now || quiz.status === 'CLOSED') {
            return 'closed';
        }

        return 'available';
    };

    const getTimeRemaining = (dueDate: Date) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due.getTime() - now.getTime();

        if (diff <= 0) return "Overdue";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h`;

        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${minutes}m`;
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    variant: 'default' as const,
                    icon: CheckCircle2,
                    text: 'Completed',
                    color: 'text-green-600'
                };
            case 'in-progress':
                return {
                    variant: 'secondary' as const,
                    icon: Clock,
                    text: 'In Progress',
                    color: 'text-blue-600'
                };
            case 'available':
                return {
                    variant: 'default' as const,
                    icon: PlayCircle,
                    text: 'Available',
                    color: 'text-green-600'
                };
            case 'closed':
                return {
                    variant: 'destructive' as const,
                    icon: AlertCircle,
                    text: 'Closed',
                    color: 'text-red-600'
                };
            default:
                return {
                    variant: 'secondary' as const,
                    icon: FileText,
                    text: 'Unknown',
                    color: 'text-gray-600'
                };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quizzes</h1>
                    <p className="text-gray-600">
                        Manage and take your course quizzes
                    </p>
                </div>

                {/* Upcoming Quizzes */}
                {upcomingQuizzes.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Quizzes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingQuizzes.map((quiz) => {
                                const status = getQuizStatus(quiz);
                                const config = getStatusConfig(status);
                                const StatusIcon = config.icon;

                                return (
                                    <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                                                <Badge variant={config.variant}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {config.text}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                {quiz.class.subjectName} • {quiz._count.questions} questions
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <BarChart3 className="h-4 w-4 text-gray-500" />
                                                <span>Max Score: {quiz.maxScore}</span>
                                            </div>

                                            {quiz.timeLimit && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span>Time Limit: {quiz.timeLimit} min</span>
                                                </div>
                                            )}

                                            {status === 'available' && (
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{getTimeRemaining(quiz.dueDate)} remaining</span>
                                                </div>
                                            )}

                                            {quiz.studentAttempt && (
                                                <div className="text-sm text-gray-600">
                                                    {quiz.studentAttempt.submittedAt ? (
                                                        <>Score: {quiz.studentAttempt.score || 0}/{quiz.maxScore}</>
                                                    ) : (
                                                        <>Attempt started</>
                                                    )}
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                {status === 'available' && (
                                                    <Button asChild className="w-full">
                                                        <Link href={`/student/quizzes/${quiz.id}`}>
                                                            <PlayCircle className="h-4 w-4 mr-2" />
                                                            Start Quiz
                                                        </Link>
                                                    </Button>
                                                )}
                                                {status === 'in-progress' && (
                                                    <Button asChild variant="secondary" className="w-full">
                                                        <Link href={`/student/quizzes/${quiz.id}/attempt/${quiz.studentAttempt.id}`}>
                                                            <Clock className="h-4 w-4 mr-2" />
                                                            Continue Quiz
                                                        </Link>
                                                    </Button>
                                                )}
                                                {status === 'completed' && (
                                                    <Button asChild variant="outline" className="w-full">
                                                        <Link href={`/student/quizzes/${quiz.id}/results`}>
                                                            <BarChart3 className="h-4 w-4 mr-2" />
                                                            View Results
                                                        </Link>
                                                    </Button>
                                                )}
                                                {status === 'closed' && (
                                                    <Button asChild variant="outline" disabled className="w-full">
                                                        <Link href={`/student/quizzes/${quiz.id}`}>
                                                            <AlertCircle className="h-4 w-4 mr-2" />
                                                            Quiz Closed
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Past Quizzes */}
                {pastQuizzes.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Quizzes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastQuizzes.map((quiz) => {
                                const status = getQuizStatus(quiz);
                                const config = getStatusConfig(status);
                                const StatusIcon = config.icon;

                                return (
                                    <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                                                <Badge variant={config.variant}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {config.text}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                {quiz.class.subjectName} • {quiz._count.questions} questions
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <BarChart3 className="h-4 w-4 text-gray-500" />
                                                <span>Max Score: {quiz.maxScore}</span>
                                            </div>

                                            {quiz.studentAttempt?.submittedAt ? (
                                                <div className="text-sm font-medium text-green-600">
                                                    Score: {quiz.studentAttempt.score || 0}/{quiz.maxScore}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-red-600">
                                                    Not attempted
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                {quiz.studentAttempt?.submittedAt ? (
                                                    <Button asChild variant="outline" className="w-full">
                                                        <Link href={`/student/quizzes/${quiz.id}/results`}>
                                                            <BarChart3 className="h-4 w-4 mr-2" />
                                                            View Results
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button asChild variant="outline" disabled className="w-full">
                                                        <Link href={`/student/quizzes/${quiz.id}`}>
                                                            <AlertCircle className="h-4 w-4 mr-2" />
                                                            Quiz Closed
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* No Quizzes Message */}
                {allQuizzes.length === 0 && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Available</h3>
                            <p className="text-gray-600 mb-4">
                                You don't have any quizzes assigned at the moment.
                            </p>
                            <Button asChild>
                                <Link href="/student/dashboard">Return to Dashboard</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}