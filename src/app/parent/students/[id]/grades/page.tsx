import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, BarChart3 } from "lucide-react";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function StudentGradesPage({ params }: PageProps) {
    const session = await requireSession(['PARENT']);
    const { id } = params;

    const student = await prisma.student.findUnique({
        where: {
            id,
            parent: {
                userId: session.user.id,
            },
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            grades: {
                include: {
                    class: {
                        select: {
                            subjectName: true,
                        },
                    },
                    assignment: {
                        select: {
                            title: true,
                            maxScore: true,
                        },
                    },
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
                },
                orderBy: { gradedAt: 'desc' },
            },
        },
    });

    if (!student) {
        notFound();
    }

    // Group grades by subject
    const gradesBySubject = student.grades.reduce((acc, grade) => {
        const subject = grade.class.subjectName;
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(grade);
        return acc;
    }, {} as Record<string, typeof student.grades>);

    // Calculate subject averages
    const subjectAverages = Object.entries(gradesBySubject).map(([subject, grades]) => {
        const average = grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;
        return {
            subject,
            average: Math.round(average),
            count: grades.length,
        };
    });

    const getPerformanceColor = (grade: number) => {
        if (grade >= 90) return "text-green-600 bg-green-100";
        if (grade >= 80) return "text-blue-600 bg-blue-100";
        if (grade >= 70) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <Link href={`/parent/students/${id}`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Student Profile
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Grades - {student.user.firstName} {student.user.lastName}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Detailed academic performance and grade history
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Subject Averages */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Subject Averages
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {subjectAverages.map(({ subject, average, count }) => (
                                        <div key={subject} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{subject}</p>
                                                <p className="text-xs text-gray-600">{count} grades</p>
                                            </div>
                                            <Badge className={getPerformanceColor(average)}>
                                                {average}
                                            </Badge>
                                        </div>
                                    ))}

                                    {subjectAverages.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No grades recorded
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grade Details */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Grade History
                                </CardTitle>
                                <CardDescription>
                                    All recorded grades and assessments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {student.grades.length > 0 ? (
                                    <div className="space-y-4">
                                        {Object.entries(gradesBySubject).map(([subject, grades]) => (
                                            <div key={subject}>
                                                <h3 className="font-semibold text-lg text-gray-900 mb-3">{subject}</h3>
                                                <div className="space-y-3">
                                                    {grades.map((grade) => (
                                                        <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">
                                                                    {grade.assignment?.title || 'General Assessment'}
                                                                </p>
                                                                <div className="text-sm text-gray-600 space-y-1 mt-1">
                                                                    <p>Teacher: {grade.teacher.user.firstName} {grade.teacher.user.lastName}</p>
                                                                    <p>Date: {new Date(grade.gradedAt).toLocaleDateString()}</p>
                                                                    {grade.assignment?.maxScore && (
                                                                        <p>Max Score: {grade.assignment.maxScore}</p>
                                                                    )}
                                                                    {grade.remarks && (
                                                                        <p>Remarks: {grade.remarks}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <Badge className={`text-lg ${getPerformanceColor(grade.score)}`}>
                                                                    {Math.round(grade.score)}
                                                                </Badge>
                                                                {grade.assignment?.maxScore && (
                                                                    <p className="text-xs text-gray-600 mt-1">
                                                                        {Math.round((grade.score / grade.assignment.maxScore) * 100)}%
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Grades Yet</h3>
                                        <p className="text-gray-600">
                                            Grades will appear here once they are recorded by teachers.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}