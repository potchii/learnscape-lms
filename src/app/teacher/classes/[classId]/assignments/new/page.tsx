// src/app/teacher/classes/[classId]/assignments/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CreateAssignmentPage() {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxScore: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    classId,
                    maxScore: formData.maxScore ? parseInt(formData.maxScore) : null,
                }),
            });

            if (response.ok) {
                router.push(`/teacher/classes/${classId}`);
            } else {
                throw new Error('Failed to create assignment');
            }
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Error creating assignment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
                <p className="text-gray-600 mt-2">Add new coursework for your students</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter assignment title"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter assignment description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Score (Optional)
                            </label>
                            <input
                                type="number"
                                id="maxScore"
                                name="maxScore"
                                value={formData.maxScore}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 100"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.push(`/teacher/classes/${classId}`)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}