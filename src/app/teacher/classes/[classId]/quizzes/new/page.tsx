// src/app/teacher/classes/[classId]/quizzes/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, Clock, Hash, Save, X } from 'lucide-react';

interface QuizQuestion {
    id: string;
    order: number;
    questionText: string;
    type: 'MULTIPLE_CHOICE';
    points: number;
    options: {
        id: string;
        text: string;
        isCorrect: boolean;
    }[];
}

export default function CreateQuizPage() {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        timeLimit: '',
        maxAttempts: '1',
        maxScore: '100',
    });
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const addQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `temp-${Date.now()}`,
            order: questions.length + 1,
            questionText: '',
            type: 'MULTIPLE_CHOICE',
            points: 1,
            options: [
                { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
                { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
                { id: `opt-${Date.now()}-3`, text: '', isCorrect: false },
                { id: `opt-${Date.now()}-4`, text: '', isCorrect: false },
            ],
        };
        setQuestions([...questions, newQuestion]);
        setActiveQuestion(questions.length);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value,
        };
        setQuestions(updatedQuestions);
    };

    const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = {
            ...updatedQuestions[questionIndex].options[optionIndex],
            [field]: value,
        };
        setQuestions(updatedQuestions);
    };

    const addOption = (questionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push({
            id: `opt-${Date.now()}`,
            text: '',
            isCorrect: false,
        });
        setQuestions(updatedQuestions);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[questionIndex].options.length > 2) {
            updatedQuestions[questionIndex].options.splice(optionIndex, 1);
            setQuestions(updatedQuestions);
        }
    };

    const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = [...questions];
        // Set all options to false first
        updatedQuestions[questionIndex].options.forEach(opt => {
            opt.isCorrect = false;
        });
        // Set the selected option as correct
        updatedQuestions[questionIndex].options[optionIndex].isCorrect = true;
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        // Update order numbers
        const reorderedQuestions = updatedQuestions.map((q, i) => ({
            ...q,
            order: i + 1,
        }));
        setQuestions(reorderedQuestions);
        if (activeQuestion === index) {
            setActiveQuestion(null);
        } else if (activeQuestion && activeQuestion > index) {
            setActiveQuestion(activeQuestion - 1);
        }
    };

    const moveQuestion = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === questions.length - 1)
        ) {
            return;
        }

        const updatedQuestions = [...questions];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap questions
        [updatedQuestions[index], updatedQuestions[newIndex]] =
            [updatedQuestions[newIndex], updatedQuestions[index]];

        // Update order numbers
        const reorderedQuestions = updatedQuestions.map((q, i) => ({
            ...q,
            order: i + 1,
        }));

        setQuestions(reorderedQuestions);
        setActiveQuestion(newIndex);
    };

    const validateQuiz = () => {
        if (!formData.title.trim()) {
            alert('Please enter a quiz title');
            return false;
        }

        if (!formData.dueDate) {
            alert('Please set a due date');
            return false;
        }

        if (questions.length === 0) {
            alert('Please add at least one question');
            return false;
        }

        for (const question of questions) {
            if (!question.questionText.trim()) {
                alert(`Question ${question.order} is missing text`);
                return false;
            }

            const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
            if (!hasCorrectAnswer) {
                alert(`Question ${question.order} must have one correct answer`);
                return false;
            }

            for (const option of question.options) {
                if (!option.text.trim()) {
                    alert(`Question ${question.order} has empty options`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateQuiz()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    classId,
                    timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null,
                    maxAttempts: parseInt(formData.maxAttempts),
                    maxScore: parseInt(formData.maxScore),
                    questions: questions.map(q => ({
                        questionText: q.questionText,
                        type: q.type,
                        points: q.points,
                        options: q.options,
                    })),
                }),
            });

            if (response.ok) {
                router.push(`/teacher/classes/${classId}`);
            } else {
                throw new Error('Failed to create quiz');
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Error creating quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Multiple Choice Quiz</h1>
                <p className="text-gray-600 mt-2">Create an interactive quiz for your students</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Quiz Basic Info */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Quiz Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter quiz title"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter quiz description"
                            />
                        </div>

                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date *
                            </label>
                            <input
                                type="datetime-local"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleFormChange}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-2">
                                Time Limit (Minutes, Optional)
                            </label>
                            <div className="relative">
                                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="number"
                                    id="timeLimit"
                                    name="timeLimit"
                                    value={formData.timeLimit}
                                    onChange={handleFormChange}
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="No time limit"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700 mb-2">
                                Max Attempts
                            </label>
                            <select
                                id="maxAttempts"
                                name="maxAttempts"
                                value={formData.maxAttempts}
                                onChange={handleFormChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="1">1 Attempt</option>
                                <option value="2">2 Attempts</option>
                                <option value="3">3 Attempts</option>
                                <option value="0">Unlimited</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700 mb-2">
                                Max Score
                            </label>
                            <div className="relative">
                                <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="number"
                                    id="maxScore"
                                    name="maxScore"
                                    value={formData.maxScore}
                                    onChange={handleFormChange}
                                    min="1"
                                    required
                                    className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Question
                        </button>
                    </div>

                    {questions.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500">No questions added yet</p>
                            <p className="text-sm text-gray-400 mt-1">Click "Add Question" to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {questions.map((question, questionIndex) => (
                                <div
                                    key={question.id}
                                    className={`border rounded-lg p-4 ${activeQuestion === questionIndex
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                                Question {question.order}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveQuestion(questionIndex, 'up')}
                                                    disabled={questionIndex === 0}
                                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveQuestion(questionIndex, 'down')}
                                                    disabled={questionIndex === questions.length - 1}
                                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-2">
                                                <label htmlFor={`points-${questionIndex}`} className="text-sm text-gray-600">
                                                    Points:
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`points-${questionIndex}`}
                                                    value={question.points}
                                                    onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(questionIndex)}
                                                className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Question Text *
                                            </label>
                                            <textarea
                                                value={question.questionText}
                                                onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
                                                required
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter your question here..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Options * (Select the correct answer)
                                            </label>
                                            <div className="space-y-2">
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={option.id} className="flex items-center gap-3">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${questionIndex}`}
                                                            checked={option.isCorrect}
                                                            onChange={() => setCorrectAnswer(questionIndex, optionIndex)}
                                                            className="text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={option.text}
                                                            onChange={(e) => updateOption(questionIndex, optionIndex, 'text', e.target.value)}
                                                            placeholder={`Option ${optionIndex + 1}`}
                                                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            required
                                                        />
                                                        {question.options.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(questionIndex, optionIndex)}
                                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => addOption(questionIndex)}
                                                className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Another Option
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quiz Summary */}
                {questions.length > 0 && (
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                        <h3 className="font-medium text-blue-900 mb-2">Quiz Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-blue-600">Total Questions:</span>
                                <span className="ml-2 font-medium">{questions.length}</span>
                            </div>
                            <div>
                                <span className="text-blue-600">Total Points:</span>
                                <span className="ml-2 font-medium">
                                    {questions.reduce((sum, q) => sum + q.points, 0)}
                                </span>
                            </div>
                            <div>
                                <span className="text-blue-600">Max Score:</span>
                                <span className="ml-2 font-medium">{formData.maxScore}</span>
                            </div>
                            <div>
                                <span className="text-blue-600">Time Limit:</span>
                                <span className="ml-2 font-medium">
                                    {formData.timeLimit ? `${formData.timeLimit} min` : 'None'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.push(`/teacher/classes/${classId}`)}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || questions.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? 'Creating...' : 'Create Quiz'}
                    </button>
                </div>
            </form>
        </div>
    );
}