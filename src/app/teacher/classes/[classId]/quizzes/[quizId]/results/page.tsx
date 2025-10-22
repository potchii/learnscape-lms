// src/app/teacher/classes/[classId]/quizzes/[quizId]/results/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    BookOpen,
    Calendar,
    Users,
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
        quizId: string;
    }>;
}

export default async function QuizResultsPage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId, quizId } = await params;

    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
            classId: classId,
        },
        include: {
            class: {
                select: {
                    subjectName: true,
                    sectionId: true,
                },
            },
            attempts: {
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                    answers: {
                        include: {
                            question: true,
                        },
                    },
                },
                orderBy: {
                    submittedAt: 'desc',
                },
            },
            questions: {
                orderBy: {
                    order: 'asc',
                },
            },
            _count: {
                select: {
                    attempts: true,
                },
            },
        },
    });

    if (!quiz) {
        return <div>Quiz not found or you don't have access to it.</div>;
    }

    // Get section data for student count
    let totalStudents = 0;
    try {
        const section = await prisma.section.findUnique({
            where: {
                id: quiz.class.sectionId,
            },
            include: {
                students: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        totalStudents = section?.students?.length || 0;
    } catch (error) {
        console.log('Section data not available');
    }

    const attemptRate = totalStudents > 0 ? (quiz._count.attempts / totalStudents) * 100 : 0;

    // Calculate statistics
    const averageScore = quiz.attempts.length > 0
        ? quiz.attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / quiz.attempts.length
        : 0;

    const passedAttempts = quiz.attempts.filter(attempt => {
        const percentage = (attempt.score || 0) / quiz.maxScore * 100;
        return percentage >= 70; // 70% passing grade
    }).length;

    const passRate = quiz.attempts.length > 0 ? (passedAttempts / quiz.attempts.length) * 100 : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href={`/teacher/classes/${classId}/tasks`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tasks
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{quiz.title} - Results</h1>
                        <p className="text-gray-600 mt-2">
                            {quiz.class.subjectName}
                        </p>
                        {quiz.description && (
                            <p className="text-gray-700 mt-3 max-w-2xl">
                                {quiz.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quiz Attempts */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Attempts</h2>
                        <div className="space-y-4">
                            {quiz.attempts.map((attempt) => {
                                const percentage = (attempt.score || 0) / quiz.maxScore * 100;
                                const isPassing = percentage >= 70;

                                return (
                                    <div
                                        key={attempt.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {attempt.student.user.firstName} {attempt.student.user.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Submitted: {attempt.submittedAt ?
                                                        new Date(attempt.submittedAt).toLocaleDateString() : 'Not submitted'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${isPassing
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {isPassing ? (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                {attempt.score !== null ? `${attempt.score}/${quiz.maxScore}` : 'Not graded'}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            {quiz.attempts.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No attempts yet</p>
                            )}
                        </div>
                    </div>

                    {/* Question Analysis */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Analysis</h2>
                        <div className="space-y-4">
                            {quiz.questions.map((question, index) => {
                                const correctAnswers = quiz.attempts.reduce((count, attempt) => {
                                    const answer = attempt.answers.find(a => a.questionId === question.id);
                                    return count + (answer?.isCorrect ? 1 : 0);
                                }, 0);

                                const correctRate = quiz.attempts.length > 0 ? (correctAnswers / quiz.attempts.length) * 100 : 0;

                                return (
                                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-gray-900">
                                                Question {index + 1}: {question.questionText}
                                            </h3>
                                            <span className="text-sm text-gray-500">{question.points} pts</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-600">
                                                Correct: {correctAnswers}/{quiz.attempts.length}
                                            </span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${correctRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-gray-600">{correctRate.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Statistics */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Statistics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Attempt Rate</span>
                                    <span className="font-medium">{attemptRate.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${attemptRate}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {quiz._count.attempts} of {totalStudents} students
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}</p>
                                    <p className="text-xs text-blue-600">Avg Score</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{passRate.toFixed(1)}%</p>
                                    <p className="text-xs text-green-600">Pass Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Details */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Due Date</span>
                                <span className="text-gray-900">
                                    {new Date(quiz.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Max Score</span>
                                <span className="text-gray-900">{quiz.maxScore} points</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Questions</span>
                                <span className="text-gray-900">{quiz.questions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Time Limit</span>
                                <span className="text-gray-900">
                                    {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Max Attempts</span>
                                <span className="text-gray-900">
                                    {quiz.maxAttempts === 0 ? 'Unlimited' : quiz.maxAttempts}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href={`/teacher/classes/${classId}/quizzes/${quizId}`}
                                className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors block"
                            >
                                View Quiz Details
                            </Link>
                            <Link
                                href={`/teacher/classes/${classId}/quizzes/${quizId}/edit`}
                                className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors block"
                            >
                                Edit Quiz
                            </Link>
                            <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
                                Publish Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}