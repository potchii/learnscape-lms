// src/components/student/quizzes/QuizStartForm.tsx
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
    BookOpen
} from "lucide-react";

interface QuizStartFormProps {
    quiz: any;
    studentId: string;
}

export function QuizStartForm({ quiz, studentId }: QuizStartFormProps) {
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);

    const handleStartQuiz = async () => {
        setIsStarting(true);
        try {
            // Create a new quiz attempt
            const response = await fetch('/api/student/quizzes/attempts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quizId: quiz.id,
                    studentId: studentId,
                }),
            });

            if (response.ok) {
                const { attemptId } = await response.json();
                router.push(`/student/dashboard/quizzes/${quiz.id}/take/${attemptId}`);
            } else {
                console.error('Failed to start quiz');
            }
        } catch (error) {
            console.error('Error starting quiz:', error);
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Instructions</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="prose prose-sm">
                        <p>Please read the following instructions carefully before starting the quiz:</p>
                        <ul className="space-y-2">
                            <li>You have <strong>{quiz.timeLimit} minutes</strong> to complete this quiz</li>
                            <li>The quiz contains <strong>{quiz._count.questions} questions</strong></li>
                            <li>Once started, the timer cannot be paused</li>
                            <li>You cannot return to previous questions after moving forward</li>
                            <li>Your work will be automatically submitted when time expires</li>
                            <li>Maximum score for this quiz is <strong>{quiz.maxScore} points</strong></li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Important Notes */}
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Important:</strong> Ensure you have a stable internet connection before starting.
                    If you lose connection, your progress may not be saved.
                </AlertDescription>
            </Alert>

            {/* Ready to Start */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Ready to Start?</span>
                    </CardTitle>
                    <CardDescription>
                        Click the button below when you're ready to begin the quiz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Time limit: {quiz.timeLimit} minutes</span>
                        </div>
                        <Button
                            onClick={handleStartQuiz}
                            disabled={isStarting}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isStarting ? "Starting..." : "Start Quiz"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}