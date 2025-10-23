"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Clock,
    FileText,
    AlertTriangle,
    CheckCircle2,
    BookOpen,
    PlayCircle,
    BarChart3
} from "lucide-react";

interface QuizStartFormProps {
    quiz: any;
    studentId: string;
}

export function QuizStartForm({ quiz, studentId }: QuizStartFormProps) {
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStartQuiz = async () => {
        setIsStarting(true);
        setError(null);
        try {
            console.log("Starting quiz:", quiz.id);
            const response = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
                method: 'POST'
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to start quiz: ${response.status}`);
                } else {
                    const text = await response.text();
                    console.error("Non-JSON response:", text);
                    throw new Error(`Server error: ${response.status}`);
                }
            }

            const attempt = await response.json();
            console.log("Attempt created:", attempt.id);
            router.push(`/student/quizzes/${quiz.id}/attempt/${attempt.id}`);
        } catch (error) {
            console.error("Error starting quiz:", error);
            setError(error instanceof Error ? error.message : 'Failed to start quiz. Please try again.');
        } finally {
            setIsStarting(false);
        }
    };

    const getTimeLimitText = () => {
        if (!quiz.timeLimit) return "No time limit";
        const hours = Math.floor(quiz.timeLimit / 60);
        const minutes = quiz.timeLimit % 60;

        if (hours > 0) {
            return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
        }
        return `${minutes} minutes`;
    };

    const getAttemptsText = () => {
        if (quiz.maxAttempts === 1) return "Single attempt";
        return `${quiz.maxAttempts} attempts allowed`;
    };

    const getQuizStatus = () => {
        const now = new Date();
        const dueDate = new Date(quiz.dueDate);

        if (now > dueDate) return "closed";
        if (quiz.status === "CLOSED") return "closed";
        if (quiz.status === "PUBLISHED") return "available";
        return "draft";
    };

    const status = getQuizStatus();
    const isAvailable = status === "available";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        {quiz.title}
                    </CardTitle>
                    <CardDescription>
                        {quiz.description || "No description provided."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Quiz Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Time Limit: {getTimeLimitText()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span>Questions: {quiz._count?.questions || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <BarChart3 className="h-4 w-4 text-gray-500" />
                            <span>Max Score: {quiz.maxScore} points</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <PlayCircle className="h-4 w-4 text-gray-500" />
                            <span>{getAttemptsText()}</span>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                            Due: {new Date(quiz.dueDate).toLocaleDateString()} at{" "}
                            {new Date(quiz.dueDate).toLocaleTimeString()}
                        </span>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Make sure you have a stable internet connection</li>
                            <li>• You cannot pause once started</li>
                            <li>• Answers are auto-saved as you progress</li>
                            {quiz.timeLimit && (
                                <li>• Timer will start when you begin the quiz</li>
                            )}
                        </ul>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Status Alert */}
                    {!isAvailable && (
                        <Alert variant={status === "closed" ? "destructive" : "default"}>
                            {status === "closed" ? (
                                <AlertTriangle className="h-4 w-4" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4" />
                            )}
                            <AlertDescription>
                                {status === "closed"
                                    ? "This quiz is no longer available for submission."
                                    : "This quiz is not yet available."}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Start Button */}
                    <div className="flex justify-center">
                        <Button
                            onClick={handleStartQuiz}
                            disabled={!isAvailable || isStarting}
                            size="lg"
                            className="min-w-32"
                        >
                            {isStarting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="h-5 w-5 mr-2" />
                                    Start Quiz
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Previous Attempts */}
                    {quiz.attempts && quiz.attempts.length > 0 && (
                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-sm mb-2">Previous Attempts:</h4>
                            <div className="space-y-2">
                                {quiz.attempts.map((attempt: any, index: number) => (
                                    <div key={attempt.id} className="flex justify-between items-center text-sm">
                                        <span>Attempt {index + 1}</span>
                                        <div className="flex items-center gap-4">
                                            <span>
                                                {attempt.submittedAt
                                                    ? `Score: ${attempt.score || 0}/${quiz.maxScore}`
                                                    : "In Progress"
                                                }
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {new Date(attempt.startedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}