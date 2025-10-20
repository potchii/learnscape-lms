"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateSectionButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        gradeLevel: "",
        name: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/admin/sections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gradeLevel: parseInt(formData.gradeLevel),
                    name: formData.name.trim(),
                }),
            });

            if (response.ok) {
                setOpen(false);
                setFormData({ gradeLevel: "", name: "" });
                window.location.reload(); // Refresh to show new section
            } else {
                const error = await response.json();
                alert(error.error || "Failed to create section");
            }
        } catch (error) {
            console.error("Error creating section:", error);
            alert("Failed to create section");
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

    const gradeLevels = Array.from({ length: 6 }, (_, i) => i + 1);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Create Section
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Section</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="gradeLevel">Grade Level *</Label>
                        <select
                            id="gradeLevel"
                            name="gradeLevel"
                            value={formData.gradeLevel}
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
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., A, B, Alpha, Beta..."
                            required
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Examples: A, B, Alpha, Beta, Red, Blue
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading || !formData.gradeLevel || !formData.name.trim()}
                        >
                            {loading ? "Creating..." : "Create Section"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}