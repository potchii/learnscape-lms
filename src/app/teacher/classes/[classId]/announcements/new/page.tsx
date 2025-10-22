// src/app/teacher/classes/[classId]/announcements/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CreateAnnouncementPage() {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    classId,
                }),
            });

            if (response.ok) {
                router.push(`/teacher/classes/${classId}`);
            } else {
                throw new Error('Failed to create announcement');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Error creating announcement. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Announcement</h1>
                <p className="text-gray-600 mt-2">Share important updates with your students</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter announcement title"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={6}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter announcement content"
                        />
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
                            {isSubmitting ? 'Creating...' : 'Create Announcement'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}