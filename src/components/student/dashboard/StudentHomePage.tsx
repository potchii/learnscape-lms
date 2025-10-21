// src/app/student/StudentHomePage.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface ClassWithProgress {
    id: string;
    subjectName: string;
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    recentActivity: Date | null;
    color: string;
}

interface StudentHomePageProps {
    classes: ClassWithProgress[];
    studentName: string;
    gradeLevel: number;
    sectionName: string;
}

export default function StudentHomePage({ classes, studentName, gradeLevel, sectionName }: StudentHomePageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<"all" | "high-progress" | "low-progress" | "recent">("all");

    // Filter classes based on search and filter
    const filteredClasses = useMemo(() => {
        let filtered = classes.filter(classItem =>
            classItem.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classItem.teacher.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classItem.teacher.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apply additional filters
        switch (selectedFilter) {
            case "high-progress":
                filtered = filtered.filter(classItem => classItem.progress >= 80);
                break;
            case "low-progress":
                filtered = filtered.filter(classItem => classItem.progress < 50);
                break;
            case "recent":
                filtered = filtered
                    .filter(classItem => classItem.recentActivity)
                    .sort((a, b) => {
                        if (!a.recentActivity) return 1;
                        if (!b.recentActivity) return -1;
                        return new Date(b.recentActivity).getTime() - new Date(a.recentActivity).getTime();
                    });
                break;
            default:
                // "all" - no additional filtering
                break;
        }

        return filtered;
    }, [classes, searchTerm, selectedFilter]);

    // Calculate stats for filtered results
    const filteredStats = useMemo(() => {
        const totalClasses = filteredClasses.length;
        const totalAssignments = filteredClasses.reduce((total, cls) => total + cls.totalAssignments, 0);
        const submittedAssignments = filteredClasses.reduce((total, cls) => total + cls.submittedAssignments, 0);
        const averageProgress = totalClasses > 0
            ? Math.round(filteredClasses.reduce((acc, cls) => acc + cls.progress, 0) / totalClasses)
            : 0;

        return {
            totalClasses,
            totalAssignments,
            submittedAssignments,
            averageProgress,
        };
    }, [filteredClasses]);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {studentName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Grade {gradeLevel} • {sectionName}
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search classes by subject or teacher name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-500 text-gray-900"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                        <button
                            onClick={() => setSelectedFilter("all")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedFilter === "all"
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                }`}
                        >
                            All Classes
                        </button>
                        <button
                            onClick={() => setSelectedFilter("high-progress")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedFilter === "high-progress"
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                }`}
                        >
                            High Progress
                        </button>
                        <button
                            onClick={() => setSelectedFilter("low-progress")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedFilter === "low-progress"
                                    ? "bg-red-100 text-red-700 border border-red-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                }`}
                        >
                            Needs Attention
                        </button>
                        <button
                            onClick={() => setSelectedFilter("recent")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedFilter === "recent"
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                }`}
                        >
                            Recently Updated
                        </button>
                    </div>
                </div>

                {/* Search Results Info */}
                <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-600">
                    <div>
                        Showing {filteredClasses.length} of {classes.length} classes
                        {searchTerm && (
                            <span> for "<span className="font-medium">{searchTerm}</span>"</span>
                        )}
                        {selectedFilter !== "all" && (
                            <span> • <span className="font-medium">{selectedFilter.replace("-", " ")}</span></span>
                        )}
                    </div>
                    {(searchTerm || selectedFilter !== "all") && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedFilter("all");
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>

            {/* Filtered Stats */}
            {filteredClasses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{filteredStats.totalClasses}</div>
                        <div className="text-sm text-gray-600">Filtered Subjects</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{filteredStats.totalAssignments}</div>
                        <div className="text-sm text-gray-600">Total Assignments</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{filteredStats.submittedAssignments}</div>
                        <div className="text-sm text-gray-600">Submitted</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{filteredStats.averageProgress}%</div>
                        <div className="text-sm text-gray-600">Average Progress</div>
                    </div>
                </div>
            )}

            {/* Classes Grid */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
                    <span className="text-gray-600">
                        {filteredClasses.length} subject{filteredClasses.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClasses.map((classItem) => (
                            <Link
                                key={classItem.id}
                                href={`/student/subjects/${classItem.id}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white ${getColorClasses(classItem.color)}`}>
                                        <span className="text-lg font-semibold">
                                            {classItem.subjectName.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">{Math.round(classItem.progress)}%</div>
                                        <div className="text-xs text-gray-500">Progress</div>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                    {classItem.subjectName}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4">
                                    {classItem.teacher.user.firstName} {classItem.teacher.user.lastName}
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                    <div
                                        className={`h-2 rounded-full ${getProgressColor(classItem.progress)}`}
                                        style={{ width: `${classItem.progress}%` }}
                                    ></div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>{classItem.submittedAssignments}/{classItem.totalAssignments} assignments</span>
                                    {classItem.recentActivity && (
                                        <span>Updated {formatTimeAgo(classItem.recentActivity)}</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm
                                ? `No classes found for "${searchTerm}"`
                                : "No classes match your current filter"
                            }
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedFilter("all");
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear search and filters
                        </button>
                    </div>
                )}
            </div>

            {/* Total Stats (Always show overall stats) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{classes.length}</div>
                    <div className="text-sm text-gray-600">Total Subjects</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {classes.reduce((total, cls) => total + cls.totalAssignments, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Assignments</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {classes.reduce((total, cls) => total + cls.submittedAssignments, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Submitted</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                        {Math.round(classes.reduce((acc, cls) => acc + cls.progress, 0) / classes.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Average Progress</div>
                </div>
            </div>
        </div>
    );
}

// Helper functions for client component
function getColorClasses(color: string): string {
    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        pink: 'bg-pink-500',
        indigo: 'bg-indigo-500',
        teal: 'bg-teal-500',
        gray: 'bg-gray-500',
    };
    return colorClasses[color] || 'bg-gray-500';
}

function getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}