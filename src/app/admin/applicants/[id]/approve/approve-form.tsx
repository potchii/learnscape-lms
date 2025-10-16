"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Parent {
    id: string;
    parentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    students: Array<{ id: string }>;
}

interface Section {
    id: string;
    name: string;
    gradeLevel: number;
    students: Array<{ id: string }>;
}

interface Applicant {
    id: string;
    applicantNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface Props {
    applicant: Applicant;
    parents: Parent[];
    sections: Section[];
}

export function ApproveApplicantForm({ applicant, parents, sections }: Props) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        parentId: "",
        sectionId: "",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/applicants/${applicant.id}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    parentId: formData.parentId,
                    sectionId: formData.sectionId,
                    notes: formData.notes,
                }),
            });

            if (response.ok) {
                router.push("/admin/applicants?message=approved");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to approve applicant");
            }
        } catch (error) {
            console.error("Approval error:", error);
            alert("Failed to approve applicant");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Assignment</h3>

                {/* Parent Selection */}
                <div className="mb-4">
                    <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
                        Assign to Parent *
                    </label>
                    <select
                        id="parentId"
                        name="parentId"
                        required
                        value={formData.parentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select a parent</option>
                        {parents.map((parent) => (
                            <option key={parent.id} value={parent.id}>
                                {parent.user.firstName} {parent.user.lastName} ({parent.parentNumber}) - {parent.students.length} student(s)
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                        Select the parent who will be responsible for this student
                    </p>
                </div>

                {/* Section Selection */}
                <div className="mb-4">
                    <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-2">
                        Assign to Section *
                    </label>
                    <select
                        id="sectionId"
                        name="sectionId"
                        required
                        value={formData.sectionId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select a section</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                Grade {section.gradeLevel} - {section.name} ({section.students.length} students)
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                        Select the class section for this student
                    </p>
                </div>

                {/* Notes */}
                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Approval Notes (Optional)
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any additional notes about this approval..."
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => router.push("/admin/applicants")}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !formData.parentId || !formData.sectionId}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Approving..." : "Approve Applicant"}
                </button>
            </div>

            {/* Help Text */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-1">What happens when you approve:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                    <li>• User role will change from APPLICANT to STUDENT</li>
                    <li>• Student record will be created with generated student number</li>
                    <li>• Applicant status will be updated to APPROVED</li>
                    <li>• Student will gain access to student dashboard</li>
                </ul>
            </div>
        </form>
    );
}