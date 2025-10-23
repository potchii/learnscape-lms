// src/app/student/dashboard/quizzes/page.tsx
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
    const session = await requireSession(["STUDENT"]);

    // Get student data
    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        include: {
            section: {
                include: {
                    classes: {
                        include: {
                            quizzes: {
                                where: {
                                    status: { in: ["PUBLISHED", "CLOSED"] }
                                },
                                include: {
                                    attempts: {
                                        where: { studentId: session.user.id },
                                        orderBy: { startedAt: 'desc' }
                                    },
                                    _count: {
                                        select: {
                                            questions: true
                                        }
                                    }
                                },
                                orderBy: { dueDate: 'asc' }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!student) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Student Not Found
                            </h2>
                            <p className="text-gray-600">
                                We couldn't find your student information.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Flatten all quizzes from all classes
    const allQuizzes = student.section.classes.flatMap(classItem =>
        classItem.quizzes.map(quiz => ({
            ...quiz,
            class: classItem,
            studentAttempt: quiz.attempts[0] || null
        }))
    );

    const getQuizStatus = (quiz: any) => {
        const now = new Date();
        const dueDate = new Date(quiz.dueDate);

        if (quiz.studentAttempt?.submittedAt) {
            return 'completed';
        }
        if (now > dueDate) {
            return 'overdue';
        }
        if (quiz.status === 'CLOSED') {
            return 'closed';
        }
        return 'available';
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            available: { variant: "default" as const, icon: PlayCircle, label: "Available", color: "text-green-600" },
            completed: { variant: "default" as const, icon: CheckCircle2, label: "Completed", color: "text-blue-600" },
            overdue: { variant: "destructive" as const, icon: AlertCircle, label: "Overdue", color: "text-red-600" },
            closed: { variant: "secondary" as const, icon: Clock, label: "Closed", color: "text-gray-600" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center space-x-1">
                <IconComponent className="h-3 w-3" />
                <span>{config.label}</span>
            </Badge>
        );
    };

    const getTimeRemaining = (dueDate: Date) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due.getTime() - now.getTime();

        if (diff <= 0) return "Due date passed";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    const availableQuizzes = allQuizzes.filter(quiz => getQuizStatus(quiz) === 'available');
    const completedQuizzes = allQuizzes.filter(quiz => getQuizStatus(quiz) === 'completed');
    const upcomingQuizzes = allQuizzes.filter(quiz => ['overdue', 'closed'].includes(getQuizStatus(quiz)));

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quizzes & Assessments</h1>
                    <p className="text-gray-600 mt-2">
                        Take quizzes and track your assessment progress
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{student.section.gradeLevel} - {student.section.name}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allQuizzes.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All assigned quizzes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                        <PlayCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{availableQuizzes.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Ready to take
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{completedQuizzes.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Finished quizzes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {completedQuizzes.length > 0
                                ? Math.round(completedQuizzes.reduce((acc, quiz) => acc + (quiz.studentAttempt?.score || 0), 0) / completedQuizzes.length)
                                : 0
                            }%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Overall performance
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Available Quizzes */}
            {availableQuizzes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <PlayCircle className="h-5 w-5 text-green-600" />
                            <span>Available Quizzes</span>
                        </CardTitle>
                        <CardDescription>
                            Quizzes ready for you to take
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {availableQuizzes.map((quiz) => (
                                <div key={quiz.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                                            {getStatusBadge(getQuizStatus(quiz))}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{quiz.class.subjectName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{quiz.timeLimit} minutes</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FileText className="h-4 w-4" />
                                                <span>{quiz._count.questions} questions</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-sm font-medium text-orange-600">
                                                {getTimeRemaining(quiz.dueDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/student/quizzes/${quiz.id}`}>
                                            Start Quiz
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Completed Quizzes */}
            {completedQuizzes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            <span>Completed Quizzes</span>
                        </CardTitle>
                        <CardDescription>
                            Quizzes you have already taken
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {completedQuizzes.map((quiz) => (
                                <div key={quiz.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                                            {getStatusBadge(getQuizStatus(quiz))}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                                        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{quiz.class.subjectName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <BarChart3 className="h-4 w-4" />
                                                <span>Score: {quiz.studentAttempt?.score || 0}/{quiz.maxScore}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Submitted: {quiz.studentAttempt?.submittedAt ? new Date(quiz.studentAttempt.submittedAt).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline">
                                        <Link href={`/student/quizzes/${quiz.id}/results`}>
                                            View Results
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upcoming/Closed Quizzes */}
            {upcomingQuizzes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-600" />
                            <span>Past Quizzes</span>
                        </CardTitle>
                        <CardDescription>
                            Quizzes that are no longer available
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingQuizzes.map((quiz) => (
                                <div key={quiz.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-75">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                                            {getStatusBadge(getQuizStatus(quiz))}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{quiz.class.subjectName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" disabled>
                                        {getQuizStatus(quiz) === 'overdue' ? 'Missed' : 'Closed'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* No Quizzes Message */}
            {allQuizzes.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Available</h3>
                            <p className="text-gray-600 mb-4">
                                You don't have any quizzes assigned at the moment.
                            </p>
                            <p className="text-sm text-gray-500">
                                Check back later for new quizzes from your teachers.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}