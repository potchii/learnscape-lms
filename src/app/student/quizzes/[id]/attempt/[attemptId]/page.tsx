"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Save,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Flag
} from "lucide-react";

interface Question {
    id: string;
    order: number;
    questionText: string;
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
    points: number;
    options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
}

interface QuizData {
    id: string;
    title: string;
    timeLimit?: number;
    maxScore: number;
    questions: Question[];
    attempt: {
        id: string;
        startedAt: string;
        submittedAt: string | null;
    };
}

export default function QuizAttemptPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.id as string;
    const attemptId = params.attemptId as string;

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

    useEffect(() => {
        loadQuizData();
    }, [quizId, attemptId]);

    useEffect(() => {
        if (quizData?.timeLimit && timeLeft !== null) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === null) return null;
                    if (prev <= 1) {
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizData?.timeLimit, timeLeft]);

    const loadQuizData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log("🔍 [PAGE] Loading quiz data for attempt:", attemptId);

            const response = await fetch(`/api/student/quizzes/${quizId}/attempt/${attemptId}`);

            console.log("🔍 [PAGE] Response status:", response.status);

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.error("❌ [PAGE] JSON error response:", errorData);
                    throw new Error(errorData.error || `Failed to load quiz: ${response.status}`);
                } else {
                    const text = await response.text();
                    console.error("❌ [PAGE] Non-JSON response:", text.substring(0, 200));
                    throw new Error(`Server error: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log("✅ [PAGE] Raw API response:", data);

            // Transform the API response to match our expected structure
            const transformedData: QuizData = {
                id: data.quiz?.id || data.id,
                title: data.quiz?.title || 'Untitled Quiz',
                timeLimit: data.quiz?.timeLimit,
                maxScore: data.quiz?.maxScore || 100,
                questions: data.quiz?.questions || [],
                attempt: {
                    id: data.id,
                    startedAt: data.startedAt,
                    submittedAt: data.submittedAt
                }
            };

            console.log("✅ [PAGE] Transformed data:", transformedData);
            console.log("✅ [PAGE] Questions count:", transformedData.questions?.length);

            setQuizData(transformedData);

            // Initialize time left if there's a time limit
            if (transformedData.timeLimit) {
                const startTime = new Date(data.startedAt).getTime();
                const currentTime = new Date().getTime();
                const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
                const remainingTime = transformedData.timeLimit * 60 - elapsedSeconds;
                setTimeLeft(Math.max(0, remainingTime));
            }

            // Load saved answers
            const savedAnswers = localStorage.getItem(`quiz_${attemptId}_answers`);
            if (savedAnswers) {
                console.log("🔍 [PAGE] Loaded saved answers");
                setAnswers(JSON.parse(savedAnswers));
            }

        } catch (error) {
            console.error("❌ [PAGE] Error loading quiz:", error);
            setError(error instanceof Error ? error.message : 'Failed to load quiz. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, value: any) => {
        const newAnswers = {
            ...answers,
            [questionId]: value
        };
        setAnswers(newAnswers);

        // Auto-save to localStorage
        localStorage.setItem(`quiz_${attemptId}_answers`, JSON.stringify(newAnswers));
    };

    const handleFlagQuestion = (questionIndex: number) => {
        const newFlagged = new Set(flaggedQuestions);
        if (newFlagged.has(questionIndex)) {
            newFlagged.delete(questionIndex);
        } else {
            newFlagged.add(questionIndex);
        }
        setFlaggedQuestions(newFlagged);
    };

    const handleNavigation = (direction: 'prev' | 'next') => {
        if (!quizData) return;

        if (direction === 'prev' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else if (direction === 'next' && currentQuestionIndex < (quizData.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmit = async () => {
        if (!quizData) return;

        setIsSubmitting(true);
        try {
            const timeSpent = quizData.timeLimit
                ? (quizData.timeLimit * 60 - (timeLeft || 0))
                : null;

            const submissionData = {
                attemptId,
                answers: Object.entries(answers).map(([questionId, answer]) => ({
                    questionId,
                    selectedOption: answer.selectedOption,
                    answerText: answer.answerText
                })),
                timeSpent
            };

            console.log("🔍 [PAGE] Submitting quiz:", submissionData);

            const response = await fetch(`/api/student/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            // Clear saved answers
            localStorage.removeItem(`quiz_${attemptId}_answers`);

            // Redirect to results page
            router.push(`/student/quizzes/${quizId}/results`);

        } catch (error) {
            console.error("❌ [PAGE] Error submitting quiz:", error);
            setError('Failed to submit quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAutoSubmit = () => {
        if (!isSubmitting) {
            handleSubmit();
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (error || !quizData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                {error || "Failed to load quiz"}
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => router.back()}
                            className="w-full mt-4"
                            variant="outline"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Safe access to questions with fallback
    const questions = quizData.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] || {} : {};

    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Questions Found</h2>
                        <p className="text-gray-600 mb-4">This quiz doesn't have any questions or the questions failed to load.</p>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{quizData.title}</h1>
                            <p className="text-gray-600">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            {timeLeft !== null && (
                                <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'
                                    }`}>
                                    {formatTime(timeLeft)}
                                </div>
                            )}

                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                variant="default"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Submit Quiz
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((question, index) => (
                                        <Button
                                            key={question.id}
                                            variant={
                                                currentQuestionIndex === index
                                                    ? "default"
                                                    : answers[question.id]
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                            size="sm"
                                            className={`relative ${flaggedQuestions.has(index) ? 'border-yellow-400 border-2' : ''
                                                }`}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                        >
                                            {index + 1}
                                            {flaggedQuestions.has(index) && (
                                                <Flag className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" />
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                        <span>Current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                                        <span>Unanswered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-600 rounded"></div>
                                        <span>Answered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Flag className="h-3 w-3 text-yellow-500" />
                                        <span>Flagged</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Question Area */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">
                                            Question {currentQuestion.order || currentQuestionIndex + 1}
                                        </CardTitle>
                                        <CardDescription>
                                            {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant={flaggedQuestions.has(currentQuestionIndex) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFlagQuestion(currentQuestionIndex)}
                                    >
                                        <Flag className={`h-4 w-4 mr-2 ${flaggedQuestions.has(currentQuestionIndex) ? 'fill-white' : ''
                                            }`} />
                                        {flaggedQuestions.has(currentQuestionIndex) ? 'Flagged' : 'Flag'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question Text */}
                                <div className="prose max-w-none">
                                    <p className="text-lg font-medium">{currentQuestion.questionText}</p>
                                </div>

                                {/* Answer Options */}
                                <div className="space-y-3">
                                    {currentQuestion.type === 'MULTIPLE_CHOICE' && currentQuestion.options && (
                                        currentQuestion.options.map((option) => (
                                            <div key={option.id} className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    id={option.id}
                                                    name={`question-${currentQuestion.id}`}
                                                    checked={currentAnswer.selectedOption === option.id}
                                                    onChange={() => handleAnswerChange(currentQuestion.id, {
                                                        selectedOption: option.id
                                                    })}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={option.id}
                                                    className="flex-1 cursor-pointer"
                                                >
                                                    {option.text}
                                                </label>
                                            </div>
                                        ))
                                    )}

                                    {currentQuestion.type === 'TRUE_FALSE' && (
                                        <>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    id="true"
                                                    name={`question-${currentQuestion.id}`}
                                                    checked={currentAnswer.selectedOption === 'true'}
                                                    onChange={() => handleAnswerChange(currentQuestion.id, {
                                                        selectedOption: 'true'
                                                    })}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="true" className="cursor-pointer">True</label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    id="false"
                                                    name={`question-${currentQuestion.id}`}
                                                    checked={currentAnswer.selectedOption === 'false'}
                                                    onChange={() => handleAnswerChange(currentQuestion.id, {
                                                        selectedOption: 'false'
                                                    })}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="false" className="cursor-pointer">False</label>
                                            </div>
                                        </>
                                    )}

                                    {currentQuestion.type === 'SHORT_ANSWER' && (
                                        <textarea
                                            value={currentAnswer.answerText || ''}
                                            onChange={(e) => handleAnswerChange(currentQuestion.id, {
                                                answerText: e.target.value
                                            })}
                                            placeholder="Type your answer here..."
                                            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-4 border-t">
                                    <Button
                                        onClick={() => handleNavigation('prev')}
                                        disabled={currentQuestionIndex === 0}
                                        variant="outline"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </Button>

                                    <Button
                                        onClick={() => handleNavigation('next')}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        variant="outline"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}