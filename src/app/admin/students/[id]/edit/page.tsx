"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Student {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        email: string;
        gender: string;
        birthdate: string;
        address: string;
        phoneNumber: string | null;
    };
    section: {
        id: string;
        name: string;
        gradeLevel: number;
    };
    parent: {
        id: string;
        parentNumber: string;
    };
}

interface Section {
    id: string;
    name: string;
    gradeLevel: number;
}

interface Parent {
    id: string;
    parentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

// Update the component to accept params as a Promise
export default function EditStudentPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        gender: "MALE",
        birthdate: "",
        address: "",
        phoneNumber: "",
        sectionId: "",
        parentId: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Unwrap the params Promise
                const unwrappedParams = await params;
                const studentId = unwrappedParams.id;

                const [studentRes, sectionsRes, parentsRes] = await Promise.all([
                    fetch(`/api/admin/students/${studentId}`),
                    fetch("/api/admin/sections"),
                    fetch("/api/admin/parents"),
                ]);

                if (studentRes.ok) {
                    const studentData = await studentRes.json();
                    setStudent(studentData);
                    setFormData({
                        firstName: studentData.user.firstName,
                        middleName: studentData.user.middleName || "",
                        lastName: studentData.user.lastName,
                        email: studentData.user.email,
                        gender: studentData.user.gender,
                        birthdate: studentData.user.birthdate.split("T")[0],
                        address: studentData.user.address,
                        phoneNumber: studentData.user.phoneNumber || "",
                        sectionId: studentData.section.id,
                        parentId: studentData.parent.id,
                    });
                } else {
                    console.error("Failed to fetch student");
                }

                if (sectionsRes.ok) {
                    const sectionsData = await sectionsRes.json();
                    setSections(sectionsData.sections || []);
                }

                if (parentsRes.ok) {
                    const parentsData = await parentsRes.json();
                    setParents(parentsData.parents || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]); // Remove .id from params

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const unwrappedParams = await params;
            const studentId = unwrappedParams.id;

            const response = await fetch(`/api/admin/students/${studentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push(`/admin/students/${studentId}?message=updated`);
            } else {
                const error = await response.json();
                alert(error.error || "Failed to update student");
            }
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update student");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Student not found</h2>
                    <Link href="/admin/sections" className="text-blue-600 hover:text-blue-800">
                        Return to sections
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link
                                href={`/admin/students/${student.id}`}
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Profile
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
                        <p className="text-gray-600">Update student information for {student.studentNumber}</p>
                    </div>
                </div>
            </div>

            {/* Rest of your form remains the same */}
            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender *
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    id="birthdate"
                                    name="birthdate"
                                    required
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address *
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Section *
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
                                            Grade {section.gradeLevel} - {section.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Parent/Guardian *
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
                                            {parent.user.firstName} {parent.user.lastName} ({parent.parentNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <Link
                            href={`/admin/students/${student.id}`}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {saving ? "Saving..." : "Update Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}