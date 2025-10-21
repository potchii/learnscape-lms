// src/app/parent/dashboard/IncompleteTasksAlerts.tsx - Enhanced version
"use client";

import { Student, Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

interface StudentWithUser extends Student {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

interface AssignmentWithDetails extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
    submissions: AssignmentSubmission[];
}

interface IncompleteTasksAlertsProps {
    students: StudentWithUser[];
    assignments: AssignmentWithDetails[];
}

export function IncompleteTasksAlerts({ students, assignments }: IncompleteTasksAlertsProps) {
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    // Get incomplete assignments for each student
    const studentIncompleteTasks = students.map(student => {
        const studentAssignments = assignments.filter(assignment => {
            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
            return !submission || submission.status === 'NOT_SUBMITTED';
        });

        const overdue = studentAssignments.filter(a => new Date(a.dueDate) < new Date());
        const dueSoon = studentAssignments.filter(a => {
            const dueDate = new Date(a.dueDate);
            const now = new Date();
            const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
            return dueDate >= now && dueDate <= twoDaysFromNow;
        });

        return {
            student,
            overdue,
            dueSoon,
            totalIncomplete: studentAssignments.length
        };
    }).filter(studentTasks => studentTasks.totalIncomplete > 0);

    if (studentIncompleteTasks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Assignment Status</h2>
                </div>
                <div className="text-center py-8">
                    <div className="text-green-400 mb-3">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">All assignments are up to date!</h3>
                    <p className="text-gray-500">No incomplete tasks for any of your students.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Incomplete Assignments</h2>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {studentIncompleteTasks.reduce((total, student) => total + student.totalIncomplete, 0)} pending
                </span>
            </div>

            <div className="space-y-4">
                {studentIncompleteTasks.map(({ student, overdue, dueSoon, totalIncomplete }) => (
                    <div key={student.id} className="border border-gray-200 rounded-lg">
                        <button
                            onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-sm">
                                            {student.user.firstName[0]}{student.user.lastName[0]}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {student.user.firstName} {student.user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {totalIncomplete} incomplete assignment{totalIncomplete !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {overdue.length > 0 && (
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                        {overdue.length} overdue
                                    </span>
                                )}
                                {dueSoon.length > 0 && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                                        {dueSoon.length} due soon
                                    </span>
                                )}
                                <svg
                                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedStudent === student.id ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {expandedStudent === student.id && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="space-y-3">
                                    {/* Overdue Assignments */}
                                    {overdue.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Overdue ({overdue.length})
                                            </h4>
                                            {overdue.map(assignment => (
                                                <div key={assignment.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded mb-2">
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                                                        <p className="text-xs text-gray-600">{assignment.class.subjectName}</p>
                                                    </div>
                                                    <span className="text-red-600 text-sm font-medium">
                                                        Overdue
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Due Soon Assignments */}
                                    {dueSoon.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-700 mb-2 flex items-center">
                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Due Soon ({dueSoon.length})
                                            </h4>
                                            {dueSoon.map(assignment => {
                                                const dueDate = new Date(assignment.dueDate);
                                                const now = new Date();
                                                const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                                                return (
                                                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded mb-2">
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                                                            <p className="text-xs text-gray-600">{assignment.class.subjectName}</p>
                                                        </div>
                                                        <span className="text-yellow-600 text-sm font-medium">
                                                            Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}