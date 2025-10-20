"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dynamically import the MD editor to avoid SSR issues
const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

interface TeacherWithClasses {
    id: string;
    classes: Array<{
        id: string;
        subjectName: string;
        section: {
            gradeLevel: number;
            name: string;
        };
    }>;
}

interface CreateAnnouncementFormProps {
    teacher: TeacherWithClasses;
    classes: TeacherWithClasses["classes"];
}

export function CreateAnnouncementForm({ teacher, classes }: CreateAnnouncementFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        classId: "",
        announcementType: "class", // "class" or "school"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/teacher/announcements", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    teacherId: teacher.id,
                    // If school-wide announcement, set classId to null
                    classId: formData.announcementType === "school" ? null : formData.classId,
                }),
            });

            if (response.ok) {
                router.push("/teacher/dashboard?message=announcement_created");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create announcement");
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
            setError("Failed to create announcement");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleContentChange = (value: string = "") => {
        setFormData({
            ...formData,
            content: value,
        });
    };

    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const getPlainTextPreview = (content: string) => {
        // Simple markdown to plain text conversion
        return content
            .replace(/#{1,6}\s?/g, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .trim();
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Announcement Type */}
                <div>
                    <Label htmlFor="announcementType">Announcement Type *</Label>
                    <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="announcementType"
                                value="class"
                                checked={formData.announcementType === "class"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Class-specific Announcement</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="announcementType"
                                value="school"
                                checked={formData.announcementType === "school"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">School-wide Announcement</span>
                        </label>
                    </div>
                </div>

                {/* Class Selection (only for class announcements) */}
                {formData.announcementType === "class" && (
                    <div>
                        <Label htmlFor="classId">Select Class *</Label>
                        <select
                            id="classId"
                            name="classId"
                            value={formData.classId}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full mt-1"
                            required={formData.announcementType === "class"}
                        >
                            <option value="">Choose a class</option>
                            {classes.map((classItem) => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.subjectName} - Grade {classItem.section.gradeLevel} {classItem.section.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Title */}
                <div>
                    <Label htmlFor="title">Announcement Title *</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Important Update, Homework Reminder, Class Event..."
                        required
                        className="mt-1"
                    />
                </div>

                {/* Content - Rich Text Editor */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="content">Announcement Content *</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPreview(!preview)}
                        >
                            {preview ? "Edit" : "Preview"}
                        </Button>
                    </div>

                    {preview ? (
                        <div className="border border-gray-300 rounded-md p-4 min-h-[200px] bg-white mt-1">
                            {formData.content ? (
                                <div className="prose prose-sm max-w-none">
                                    <div data-color-mode="light">
                                        <div className="wmde-markdown-var"> </div>
                                        <div className="markdown-body">
                                            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-center py-8">
                                    No content to preview
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-1">
                            <MDEditor
                                value={formData.content}
                                onChange={handleContentChange}
                                preview="edit"
                                height={200}
                                visibleDragbar={false}
                                style={{
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                }}
                            />
                        </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                        Supports Markdown formatting. Use # for headers, **bold**, *italic*, and lists.
                    </p>
                </div>

                {/* Character Count */}
                <div className="text-sm text-gray-500">
                    Characters: {getPlainTextPreview(formData.content).length}
                    {getPlainTextPreview(formData.content).length > 1000 && (
                        <span className="text-orange-600 ml-2">
                            (Long announcements may be truncated in notifications)
                        </span>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading || !formData.title || !formData.content || (formData.announcementType === "class" && !formData.classId)}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                            </>
                        ) : (
                            'Publish Announcement'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}