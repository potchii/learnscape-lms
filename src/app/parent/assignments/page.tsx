import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParentAssignmentsView } from "@/components/parent/dashboard/ParentAssignmentsView";
import { FileText, Calendar, AlertTriangle, CheckCircle2, Clock, BookOpen } from "lucide-react";

interface StudentWithUser {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        id: string; // Add section id
        gradeLevel: number;
        name: string;
    };
}

interface AssignmentWithDetails {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    class: {
        id: string;
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        section: {
            id: string; // Add section id
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        id: string;
        studentId: string;
        status: string;
        submittedAt: Date | null;
        score: number | null;
        feedback: string | null;
    }>;
}

export default async function ParentAssignmentsPage() {
    const session = await requireSession(['PARENT']);

    const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
        include: {
            students: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    section: {
                        select: {
                            id: true, // Include section id
                            gradeLevel: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!parent) {
        return <div>Parent not found</div>;
    }

    const students: StudentWithUser[] = parent.students;

    // Get assignments for all student sections
    const studentIds = students.map(student => student.id);
    const sectionIds = students.map(student => student.section.id); // Fix: use student.section.id

    const assignments = await prisma.assignment.findMany({
        where: {
            OR: [
                {
                    class: {
                        sectionId: {
                            in: sectionIds,
                        },
                    },
                },
            ],
            status: 'PUBLISHED',
        },
        include: {
            class: {
                include: {
                    teacher: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                    section: {
                        select: {
                            id: true, // Include section id
                            gradeLevel: true,
                            name: true,
                        },
                    },
                },
            },
            submissions: {
                where: {
                    studentId: {
                        in: studentIds,
                    },
                },
            },
        },
        orderBy: { dueDate: 'asc' },
    });

    // Calculate assignment statistics
    const getAssignmentStats = () => {
        const now = new Date();

        const overdueAssignments = assignments.filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            const isOverdue = dueDate < now;

            if (!isOverdue) return false;

            // Check if any relevant student hasn't submitted
            return assignment.submissions.some(submission =>
                studentIds.includes(submission.studentId) &&
                submission.status !== 'SUBMITTED'
            );
        });

        const dueThisWeek = assignments.filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return dueDate >= now && dueDate <= oneWeekFromNow;
        });

        const submittedCount = assignments.reduce((count, assignment) => {
            const studentSubmissions = assignment.submissions.filter(sub =>
                studentIds.includes(sub.studentId)
            );
            return count + studentSubmissions.filter(sub => sub.status === 'SUBMITTED').length;
        }, 0);

        const totalPossibleSubmissions = assignments.length * students.length;

        return {
            totalAssignments: assignments.length,
            overdueCount: overdueAssignments.length,
            dueThisWeekCount: dueThisWeek.length,
            submittedCount,
            submissionRate: totalPossibleSubmissions > 0 ?
                Math.round((submittedCount / totalPossibleSubmissions) * 100) : 0,
        };
    };

    const stats = getAssignmentStats();

    // Get assignments by status for quick filtering
    const getAssignmentsByStatus = () => {
        const now = new Date();

        return {
            overdue: assignments.filter(assignment => {
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = dueDate < now;

                if (!isOverdue) return false;

                return assignment.submissions.some(submission =>
                    studentIds.includes(submission.studentId) &&
                    submission.status !== 'SUBMITTED'
                );
            }),

            dueThisWeek: assignments.filter(assignment => {
                const dueDate = new Date(assignment.dueDate);
                const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return dueDate >= now && dueDate <= oneWeekFromNow;
            }),

            submitted: assignments.filter(assignment =>
                assignment.submissions.some(submission =>
                    studentIds.includes(submission.studentId) &&
                    submission.status === 'SUBMITTED'
                )
            ),

            all: assignments,
        };
    };

    const assignmentsByStatus = getAssignmentsByStatus();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                    <p className="text-gray-600 mt-2">
                        Track academic work, submissions, and grades for all your children
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Stats and Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">Total</span>
                                    </div>
                                    <span className="font-semibold">{stats.totalAssignments}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">Overdue</span>
                                    </div>
                                    <span className="font-semibold text-red-600">{stats.overdueCount}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">Due This Week</span>
                                    </div>
                                    <span className="font-semibold text-yellow-600">{stats.dueThisWeekCount}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Submitted</span>
                                    </div>
                                    <span className="font-semibold text-green-600">
                                        {stats.submittedCount} ({stats.submissionRate}%)
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Filters */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Filters</CardTitle>
                                <CardDescription>
                                    View assignments by status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="#overdue" scroll={false}>
                                            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                            Overdue ({assignmentsByStatus.overdue.length})
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="#this-week" scroll={false}>
                                            <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                            Due This Week ({assignmentsByStatus.dueThisWeek.length})
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="#submitted" scroll={false}>
                                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                            Submitted ({assignmentsByStatus.submitted.length})
                                        </Link>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="#all" scroll={false}>
                                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                            All Assignments ({assignmentsByStatus.all.length})
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Student List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>My Students</CardTitle>
                                <CardDescription>
                                    Assignment status by student
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {students.map((student) => {
                                        const studentAssignments = assignments.filter(assignment =>
                                            assignment.class.section.id === student.section.id // Fix: use assignment.class.section.id
                                        );

                                        const submittedCount = studentAssignments.filter(assignment =>
                                            assignment.submissions.some(sub =>
                                                sub.studentId === student.id && sub.status === 'SUBMITTED'
                                            )
                                        ).length;

                                        const overdueCount = studentAssignments.filter(assignment => {
                                            const dueDate = new Date(assignment.dueDate);
                                            const isOverdue = dueDate < new Date();

                                            if (!isOverdue) return false;

                                            const submission = assignment.submissions.find(sub => sub.studentId === student.id);
                                            return !submission || submission.status !== 'SUBMITTED';
                                        }).length;

                                        return (
                                            <div
                                                key={student.id}
                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">
                                                        {student.user.firstName} {student.user.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Grade {student.section.gradeLevel}
                                                    </p>
                                                </div>
                                                <div className="text-right text-xs">
                                                    <div className={`font-semibold ${overdueCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {submittedCount}/{studentAssignments.length}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {overdueCount > 0 && (
                                                            <span className="text-red-500">{overdueCount} overdue</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Subjects Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Subjects</CardTitle>
                                <CardDescription>
                                    Assignments by subject
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {Array.from(new Set(assignments.map(a => a.class.subjectName))).map(subject => {
                                        const subjectAssignments = assignments.filter(a => a.class.subjectName === subject);
                                        const subjectStudents = students.filter(student =>
                                            subjectAssignments.some(assignment =>
                                                assignment.class.section.id === student.section.id // Fix: use assignment.class.section.id
                                            )
                                        );

                                        return (
                                            <div key={subject} className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-900">{subject}</span>
                                                <Badge variant="secondary">{subjectAssignments.length}</Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Assignments List */}
                    <div className="lg:col-span-3">
                        <ParentAssignmentsView
                            students={students}
                            assignments={assignments}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}