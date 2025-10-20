"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface CreateAssignmentFormProps {
    teacher: TeacherWithClasses;
    classes: TeacherWithClasses["classes"];
}

export function CreateAssignmentForm({ teacher, classes }: CreateAssignmentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        classId: "",
        dueDate: "",
        maxScore: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/teacher/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    maxScore: formData.maxScore ? parseInt(formData.maxScore) : null,
                    teacherId: teacher.id,
                }),
            });

            if (response.ok) {
                router.push("/teacher/dashboard?message=assignment_created");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create assignment");
            }
        } catch (error) {
            console.error("Error creating assignment:", error);
            setError("Failed to create assignment");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class Selection */}
                <div>
                    <Label htmlFor="classId">Class *</Label>
                    <select
                        id="classId"
                        name="classId"
                        value={formData.classId}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full mt-1"
                        required
                    >
                        <option value="">Select a class</option>
                        {classes.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                                {classItem.subjectName} - Grade {classItem.section.gradeLevel} {classItem.section.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Assignment Title */}
                <div>
                    <Label htmlFor="title">Assignment Title *</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Chapter 5 Exercises, Research Paper, Lab Report..."
                        required
                        className="mt-1"
                    />
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide detailed instructions for the assignment..."
                        rows={4}
                        className="mt-1"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Due Date */}
                    <div>
                        <Label htmlFor="dueDate">Due Date *</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="datetime-local"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                            className="mt-1"
                        />
                    </div>

                    {/* Max Score */}
                    <div>
                        <Label htmlFor="maxScore">Maximum Score (Optional)</Label>
                        <Input
                            id="maxScore"
                            name="maxScore"
                            type="number"
                            value={formData.maxScore}
                            onChange={handleChange}
                            placeholder="e.g., 100"
                            min="1"
                            className="mt-1"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
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
                        disabled={loading || !formData.classId || !formData.title || !formData.dueDate}
                    >
                        {loading ? "Creating..." : "Create Assignment"}
                    </Button>
                </div>
            </form>
        </div>
    );
}