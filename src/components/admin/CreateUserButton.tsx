"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Parent {
    id: string;
    parentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface Section {
    id: string;
    name: string;
    gradeLevel: number;
}

export default function CreateUserButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [parents, setParents] = useState<Parent[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "APPLICANT",
        parentId: "",
        sectionId: "",
    });

    // Fetch parents and sections when dialog opens
    useEffect(() => {
        if (open) {
            fetchParentsAndSections();
        }
    }, [open]);

    const fetchParentsAndSections = async () => {
        try {
            // You might want to create API endpoints for these
            const [parentsRes, sectionsRes] = await Promise.all([
                fetch("/api/admin/parents"),
                fetch("/api/admin/sections")
            ]);

            if (parentsRes.ok) {
                const parentsData = await parentsRes.json();
                setParents(parentsData.parents || []);
            }

            if (sectionsRes.ok) {
                const sectionsData = await sectionsRes.json();
                setSections(sectionsData.sections || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data based on role
            const submitData = form.role === "STUDENT"
                ? form // Include parentId and sectionId for students
                : { ...form, parentId: undefined, sectionId: undefined }; // Exclude for other roles

            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            if (res.ok) {
                setOpen(false);
                // Reset form
                setForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    role: "APPLICANT",
                    parentId: "",
                    sectionId: "",
                });
                window.location.reload(); // reload table
            } else {
                const error = await res.json();
                alert(error.error || "Error creating user");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error creating user");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "APPLICANT",
            parentId: "",
            sectionId: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
        }}>
            <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">+ Create New User</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Basic Information</h3>

                        <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <div>
                            <Label htmlFor="role">Role *</Label>
                            <select
                                id="role"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                            >
                                <option value="APPLICANT">APPLICANT</option>
                                <option value="STUDENT">STUDENT</option>
                                <option value="PARENT">PARENT</option>
                                <option value="TEACHER">TEACHER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>

                    {/* Student-Specific Fields */}
                    {form.role === "STUDENT" && (
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-medium text-gray-900">Student Assignment</h3>

                            <div>
                                <Label htmlFor="parentId">Parent *</Label>
                                <select
                                    id="parentId"
                                    name="parentId"
                                    value={form.parentId}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                >
                                    <option value="">Select a parent</option>
                                    {parents.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.user.firstName} {parent.user.lastName} ({parent.parentNumber})
                                        </option>
                                    ))}
                                </select>
                                {parents.length === 0 && (
                                    <p className="text-xs text-yellow-600 mt-1">
                                        No parents found. Please create a parent first.
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="sectionId">Section *</Label>
                                <select
                                    id="sectionId"
                                    name="sectionId"
                                    value={form.sectionId}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                                >
                                    <option value="">Select a section</option>
                                    {sections.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            Grade {section.gradeLevel} - {section.name}
                                        </option>
                                    ))}
                                </select>
                                {sections.length === 0 && (
                                    <p className="text-xs text-yellow-600 mt-1">
                                        No sections found. Please create a section first.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading || (form.role === "STUDENT" && (!form.parentId || !form.sectionId))}
                        >
                            {loading ? "Creating..." : "Create User"}
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-800 text-sm mb-1">What happens:</h4>
                        <ul className="text-blue-700 text-xs space-y-1">
                            <li>• User account will be created</li>
                            <li>• Role-specific record will be generated</li>
                            <li>• Human-friendly ID will be assigned automatically</li>
                            {form.role === "STUDENT" && (
                                <li>• Student will be assigned to selected parent and section</li>
                            )}
                        </ul>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}