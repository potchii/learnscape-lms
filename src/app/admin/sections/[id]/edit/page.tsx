"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Section {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Array<{ id: string }>;
}

export default function EditSectionPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [section, setSection] = useState<Section | null>(null);
    const [form, setForm] = useState({
        gradeLevel: "",
        name: "",
    });

    const sectionId = params.id as string;

    useEffect(() => {
        fetchSection();
    }, [sectionId]);

    const fetchSection = async () => {
        try {
            const res = await fetch(`/api/admin/sections/${sectionId}`);
            if (res.ok) {
                const data = await res.json();
                setSection(data.section);
                setForm({
                    gradeLevel: data.section.gradeLevel.toString(),
                    name: data.section.name,
                });
            } else {
                console.error("Failed to fetch section");
            }
        } catch (error) {
            console.error("Error fetching section:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/sections/${sectionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gradeLevel: parseInt(form.gradeLevel),
                    name: form.name.trim()
                }),
            });

            if (res.ok) {
                router.push("/admin/sections?message=updated");
            } else {
                const error = await res.json();
                alert(error.error || "Error updating section");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating section");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);

        try {
            const res = await fetch(`/api/admin/sections/${sectionId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/admin/sections?message=deleted");
            } else {
                const error = await res.json();
                alert(error.error || "Error deleting section");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting section");
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const gradeLevels = Array.from({ length: 6 }, (_, i) => i + 1);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading section...</div>
                </div>
            </div>
        );
    }

    if (!section) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Section Not Found</h2>
                    <p className="text-red-700 mt-2">The section you're trying to edit doesn't exist.</p>
                    <Link href="/admin/sections" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                        Return to Sections
                    </Link>
                </div>
            </div>
        );
    }

    const hasStudents = section.students.length > 0;
    const hasClasses = section.classes.length > 0;
    const canDelete = !hasStudents && !hasClasses;

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-6">
                <Link
                    href="/admin/sections"
                    className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
                >
                    ← Back to Sections
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Edit Section</h1>
                <p className="text-gray-600">Update section details</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Current Section Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Current Section Information</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Grade Level:</span> Grade {section.gradeLevel}
                        </div>
                        <div>
                            <span className="font-medium">Section Name:</span> {section.name}
                        </div>
                        <div>
                            <span className="font-medium">Students:</span> {section.students.length}
                        </div>
                        <div>
                            <span className="font-medium">Classes:</span> {section.classes.length}
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="gradeLevel">Grade Level *</Label>
                        <select
                            id="gradeLevel"
                            name="gradeLevel"
                            value={form.gradeLevel}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full mt-1"
                            required
                        >
                            <option value="">Select Grade</option>
                            {gradeLevels.map(grade => (
                                <option key={grade} value={grade}>
                                    Grade {grade}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="name">Section Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g., A, B, Alpha, Beta..."
                            required
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Examples: A, B, Alpha, Beta, Red, Blue
                        </p>
                    </div>

                    {/* Warning for dependencies */}
                    {(section.students.length > 0 || section.classes.length > 0) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-yellow-800">Note about dependencies</h3>
                                    <p className="text-yellow-700 text-sm mt-1">
                                        This section has {section.students.length} student(s) and {section.classes.length} class(es).
                                        Changing the grade level may affect class assignments and student records.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        {/* Delete Button */}
                        <div>
                            {!showDeleteConfirm ? (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                    Delete Section
                                </button>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-red-600 font-medium">Confirm deletion?</span>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={deleting || !canDelete}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {deleting ? "Deleting..." : "Yes, Delete"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-3 py-1 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Save/Cancel Buttons */}
                        <div className="flex space-x-3">
                            <Link
                                href="/admin/sections"
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={saving || !form.gradeLevel || !form.name.trim()}
                            >
                                {saving ? "Updating..." : "Update Section"}
                            </Button>
                        </div>
                    </div>

                    {/* Delete Warning Message */}
                    {showDeleteConfirm && !canDelete && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-red-800">Cannot Delete Section</h3>
                                    <p className="text-red-700 text-sm mt-1">
                                        This section cannot be deleted because it contains:
                                    </p>
                                    <ul className="text-red-700 text-sm mt-2 space-y-1">
                                        {hasStudents && (
                                            <li>• {section.students.length} student(s) - Reassign or remove students first</li>
                                        )}
                                        {hasClasses && (
                                            <li>• {section.classes.length} class(es) - Reassign or delete classes first</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Message */}
                    {showDeleteConfirm && canDelete && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-red-800">Warning: This action cannot be undone</h3>
                                    <p className="text-red-700 text-sm mt-1">
                                        Are you sure you want to delete <strong>Grade {section.gradeLevel} - {section.name}</strong>?
                                        This action is permanent and cannot be reversed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}