"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Section {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Array<{ id: string }>;
}

interface DeleteSectionButtonProps {
    section: Section;
    onSectionDeleted: () => void;
}

export default function DeleteSectionButton({ section, onSectionDeleted }: DeleteSectionButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/sections/${section.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setOpen(false);
                onSectionDeleted();
            } else {
                const error = await res.json();
                alert(error.error || "Error deleting section");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting section");
        } finally {
            setLoading(false);
        }
    };

    const hasStudents = section.students.length > 0;
    const hasClasses = section.classes.length > 0;
    const canDelete = !hasStudents && !hasClasses;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700">
                    Delete
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Section</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {canDelete ? (
                        <>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-medium text-red-800">Warning: This action cannot be undone</h3>
                                        <p className="text-red-700 text-sm mt-1">
                                            Are you sure you want to delete <strong>Grade {section.gradeLevel} - {section.name}</strong>?
                                        </p>
                                    </div>
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
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : "Delete Section"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-yellow-800">Cannot Delete Section</h3>
                                    <p className="text-yellow-700 text-sm mt-1">
                                        This section cannot be deleted because it contains:
                                    </p>
                                    <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                                        {hasStudents && (
                                            <li>• {section.students.length} student(s) - Reassign or remove students first</li>
                                        )}
                                        {hasClasses && (
                                            <li>• {section.classes.length} class(es) - Reassign or delete classes first</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-end pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}