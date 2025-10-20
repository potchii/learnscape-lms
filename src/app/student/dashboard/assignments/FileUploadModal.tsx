"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    class: {
        subjectName: string;
    };
}

interface FileUploadModalProps {
    assignment: Assignment;
}

export function FileUploadModal({ assignment }: FileUploadModalProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Basic file validation
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
            setError("Please select a file");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("assignmentId", assignment.id);

            const response = await fetch("/api/student/assignments/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setOpen(false);
                setFile(null);
                // Refresh the page to show updated submission status
                window.location.reload();
            } else {
                setError(result.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const getFileTypeIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            case 'zip':
            case 'rar':
                return '📦';
            default:
                return '📎';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    {assignment.submissions?.[0] ? "Resubmit" : "Submit"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Submit Assignment</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.class.subjectName}</p>
                        <p className="text-sm text-gray-500">
                            Due: {assignment.dueDate.toLocaleDateString()}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="file">Upload File *</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.zip"
                                className="mt-1"
                                disabled={uploading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Supported formats: PDF, Word, Images, Text, ZIP (Max 10MB)
                            </p>
                        </div>

                        {file && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{getFileTypeIcon(file.name)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-green-800 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="text-red-600 hover:text-red-800"
                                        disabled={uploading}
                                    >
                                        ✕
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={uploading || !file}
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    'Submit Assignment'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}