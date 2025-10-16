"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateSectionButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        gradeLevel: "1",
        name: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gradeLevel: parseInt(form.gradeLevel),
                    name: form.name.trim()
                }),
            });

            if (res.ok) {
                setOpen(false);
                setForm({ gradeLevel: "1", name: "" });
                window.location.reload(); // Simple page reload
            } else {
                const error = await res.json();
                alert(error.error || "Error creating section");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error creating section");
        } finally {
            setLoading(false);
        }
    };

    const gradeLevels = Array.from({ length: 6 }, (_, i) => i + 1);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 text-white hover:bg-green-700">
                    + Create Section
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Section</DialogTitle>
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

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-800 text-sm mb-1">Section Format:</h4>
                        <p className="text-blue-700 text-xs">
                            This will create: <strong>Grade {form.gradeLevel} - {form.name || "Section"}</strong>
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={loading || !form.gradeLevel || !form.name.trim()}
                    >
                        {loading ? "Creating..." : "Create Section"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}