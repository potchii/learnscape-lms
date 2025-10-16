"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Section {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Array<{ id: string }>;
}

interface EditSectionButtonProps {
    section: Section;
    onSectionUpdated: () => void;
}

export default function EditSectionButton({ section, onSectionUpdated }: EditSectionButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        gradeLevel: section.gradeLevel.toString(),
        name: section.name,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/sections/${section.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gradeLevel: parseInt(form.gradeLevel),
                    name: form.name.trim()
                }),
            });

            if (res.ok) {
                setOpen(false);
                onSectionUpdated();
            } else {
                const error = await res.json();
                alert(error.error || "Error updating section");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating section");
        } finally {
            setLoading(false);
        }
    };

    const gradeLevels = Array.from({ length: 12 }, (_, i) => i + 1); // Grades 1-12

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
                    Edit
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Section</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div>
                        <Label htmlFor="gradeLevel">Grade Level *</Label>
                        <select
                            id="gradeLevel"
                            name="gradeLevel"
                            value={form.gradeLevel}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
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
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Examples: A, B, Alpha, Beta, Red, Blue
                        </p>
                    </div>

                    {/* Section Statistics */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h4 className="font-medium text-gray-800 text-sm mb-2">Current Section Info:</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Students:</strong> {section.students.length}</p>
                            <p><strong>Classes:</strong> {section.classes.length}</p>
                            <p className="text-xs text-yellow-600 mt-2">
                                Note: Changing grade level may affect class assignments.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
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
                            disabled={loading || !form.gradeLevel || !form.name.trim()}
                        >
                            {loading ? "Updating..." : "Update Section"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}