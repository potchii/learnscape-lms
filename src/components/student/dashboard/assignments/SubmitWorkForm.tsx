"use client";

import { useState } from "react";
import { Assignment } from "@prisma/client";
import { useRouter } from "next/navigation";

interface SubmitWorkFormProps {
    assignment: Assignment;
    studentId: string;
}

export function SubmitWorkForm({ assignment, studentId }: SubmitWorkFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError("File size must be less than 10MB");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file to submit");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("assignmentId", assignment.id);
            formData.append("studentId", studentId);

            const response = await fetch("/api/student/assignments/submit", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                router.push(`/student/dashboard/assignments/${assignment.id}?submitted=true`);
                router.refresh();
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Submission failed");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setError("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Work</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Your File
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.zip"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Supported formats: PDF, Word, Images, Text, ZIP (Max 10MB)
                        </p>
                    </div>

                    {file && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">📎</span>
                                    <div>
                                        <p className="font-medium text-green-800">{file.name}</p>
                                        <p className="text-sm text-green-600">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-red-600 hover:text-red-800"
                                    disabled={isSubmitting}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !file}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Assignment'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}