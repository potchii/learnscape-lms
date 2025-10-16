"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
}

export function RejectApplicantForm({ applicant }: Props) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const predefinedReasons = [
        "Incomplete application",
        "Does not meet age requirements",
        "Missing required documents",
        "Academic requirements not met",
        "Capacity reached for this grade level",
        "Other (specify in notes)"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/applicants/${applicant.id}/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reason: rejectionReason,
                }),
            });

            if (response.ok) {
                router.push("/admin/applicants?message=rejected");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to reject applicant");
            }
        } catch (error) {
            console.error("Rejection error:", error);
            alert("Failed to reject applicant");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rejection Details</h3>

                {/* Predefined Reasons */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Rejection Reason *
                    </label>
                    <div className="space-y-2">
                        {predefinedReasons.map((reason) => (
                            <label key={reason} className="flex items-start">
                                <input
                                    type="radio"
                                    name="rejectionReason"
                                    value={reason}
                                    checked={rejectionReason === reason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="mt-1 text-red-600 focus:ring-red-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">{reason}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Custom Reason */}
                <div className="mb-4">
                    <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2">
                        Or provide custom reason:
                    </label>
                    <textarea
                        id="customReason"
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter detailed rejection reason..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => router.push("/admin/applicants")}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !rejectionReason.trim()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Rejecting..." : "Reject Applicant"}
                </button>
            </div>

            {/* Help Text */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-1">What happens when you reject:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                    <li>• Applicant status will be updated to REJECTED</li>
                    <li>• User will remain as APPLICANT role (cannot access student features)</li>
                    <li>• No student record will be created</li>
                    <li>• Applicant can see rejection status in their portal</li>
                    <li>• This action is permanent and cannot be undone</li>
                </ul>
            </div>
        </form>
    );
}