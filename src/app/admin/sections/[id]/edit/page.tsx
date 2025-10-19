"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Teacher {
    id: string;
    employeeNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    classes: Array<{
        id: string;
        subjectName: string;
        section: {
            name: string;
            gradeLevel: number;
        };
    }>;
}

interface Class {
    id: string;
    subjectName: string;
    schedule: string | null;
    teacher: {
        id: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}

interface Section {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Class[];
}

export default function EditSectionPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [section, setSection] = useState<Section | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [teachersLoading, setTeachersLoading] = useState(true);
    const [form, setForm] = useState({
        gradeLevel: "",
        name: "",
    });
    const [classForm, setClassForm] = useState({
        subjectName: "",
        teacherId: "",
        schedule: "",
    });
    const [editingClass, setEditingClass] = useState<Class | null>(null);

    const sectionId = params.id as string;

    useEffect(() => {
        fetchSection();
        fetchTeachers();
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

    const fetchTeachers = async () => {
        try {
            setTeachersLoading(true);
            console.log("Fetching teachers from /api/admin/teacher...");

            const res = await fetch('/api/admin/teacher'); // Changed to singular
            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Teachers data:", data);
                setTeachers(data.teachers || []);
            } else {
                console.error("Failed to fetch teachers:", res.status);
                const errorText = await res.text();
                console.error("Error response:", errorText);
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setTeachersLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClassFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setClassForm({ ...classForm, [e.target.name]: e.target.value });
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

    const handleAddClass = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!classForm.subjectName.trim() || !classForm.teacherId) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            const res = await fetch(`/api/admin/sections/${sectionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjectName: classForm.subjectName.trim(),
                    teacherId: classForm.teacherId,
                    schedule: classForm.schedule.trim(),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setClassForm({ subjectName: "", teacherId: "", schedule: "" });
                fetchSection(); // Refresh section data
            } else {
                const error = await res.json();
                alert(error.error || "Error creating class");
            }
        } catch (error) {
            console.error("Error creating class:", error);
            alert("Error creating class");
        }
    };

    const handleUpdateClass = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingClass || !classForm.subjectName.trim() || !classForm.teacherId) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            const res = await fetch(`/api/admin/sections/${sectionId}/classes/${editingClass.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjectName: classForm.subjectName.trim(),
                    teacherId: classForm.teacherId,
                    schedule: classForm.schedule.trim(),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setEditingClass(null);
                setClassForm({ subjectName: "", teacherId: "", schedule: "" });
                fetchSection(); // Refresh section data
            } else {
                const error = await res.json();
                alert(error.error || "Error updating class");
            }
        } catch (error) {
            console.error("Error updating class:", error);
            alert("Error updating class");
        }
    };

    const handleDeleteClass = async (classId: string) => {
        if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/sections/${sectionId}/classes/${classId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Class deleted successfully");
                fetchSection(); // Refresh section data
            } else {
                const error = await res.json();
                alert(error.error || "Error deleting class");
            }
        } catch (error) {
            console.error("Error deleting class:", error);
            alert("Error deleting class");
        }
    };

    const startEditClass = (classItem: Class) => {
        setEditingClass(classItem);
        setClassForm({
            subjectName: classItem.subjectName,
            teacherId: classItem.teacher.id,
            schedule: classItem.schedule || "",
        });
    };

    const cancelEdit = () => {
        setEditingClass(null);
        setClassForm({ subjectName: "", teacherId: "", schedule: "" });
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
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <Link
                    href="/admin/sections"
                    className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
                >
                    ← Back to Sections
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Edit Section</h1>
                <p className="text-gray-600">Update section details and manage classes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section Details */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Information</h2>

                    {/* Current Section Info */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Current Information</h3>
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
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={saving || !form.gradeLevel || !form.name.trim()}
                            >
                                {saving ? "Updating..." : "Update Section"}
                            </Button>
                            <Link
                                href="/admin/sections"
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Class Management */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Management</h2>

                    {/* Add/Edit Class Form */}
                    <form onSubmit={editingClass ? handleUpdateClass : handleAddClass} className="space-y-4 mb-6">
                        <div>
                            <Label htmlFor="subjectName">Subject Name *</Label>
                            <Input
                                id="subjectName"
                                name="subjectName"
                                value={classForm.subjectName}
                                onChange={handleClassFormChange}
                                placeholder="e.g., Mathematics, Science, English..."
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="teacherId">Teacher *</Label>
                            <select
                                id="teacherId"
                                name="teacherId"
                                value={classForm.teacherId}
                                onChange={handleClassFormChange}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full mt-1"
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.user.firstName} {teacher.user.lastName} ({teacher.employeeNumber})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="schedule">Schedule (Optional)</Label>
                            <Input
                                id="schedule"
                                name="schedule"
                                value={classForm.schedule}
                                onChange={handleClassFormChange}
                                placeholder="e.g., Mon-Wed-Fri 9:00 AM"
                                className="mt-1"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {editingClass ? "Update Class" : "Add Class"}
                            </Button>
                            {editingClass && (
                                <Button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Classes List */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Classes</h3>
                        {section.classes.length > 0 ? (
                            <div className="space-y-3">
                                {section.classes.map(classItem => (
                                    <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{classItem.subjectName}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Teacher: {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                                                </p>
                                                {classItem.schedule && (
                                                    <p className="text-sm text-gray-600">Schedule: {classItem.schedule}</p>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => startEditClass(classItem)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClass(classItem.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-gray-500">No classes assigned to this section yet.</p>
                                <p className="text-sm text-gray-400 mt-1">Add your first class above.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section Delete Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
                        <p className="text-gray-600 text-sm">Permanently delete this section</p>
                    </div>

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
                </div>

                {/* Delete Warning Messages */}
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
            </div>
        </div>
    );
}