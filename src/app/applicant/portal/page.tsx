// src/app/applicant/portal/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    User,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Calendar,
    Hash,
    GraduationCap
} from "lucide-react";
import Link from "next/link";

export default async function ApplicantPortalPage() {
    const session = await requireSession(["APPLICANT"]);

    const applicant = await prisma.applicant.findUnique({
        where: { userId: session.user.id },
        include: {
            user: {
                select: {
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    email: true,
                    gender: true,
                    birthdate: true,
                    address: true,
                    phoneNumber: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!applicant) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Application Not Found
                            </h2>
                            <p className="text-gray-600 mb-4">
                                We couldn't find your application. Please contact support.
                            </p>
                            <Button asChild>
                                <Link href="/login">Return to Login</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Parse personalInfo to get grade level
    let appliedGrade = "Not specified";
    try {
        if (applicant.personalInfo) {
            const personalInfo = JSON.parse(applicant.personalInfo);
            appliedGrade = personalInfo.appliedGrade || personalInfo.gradeLevel || "Not specified";
        }
    } catch (error) {
        // If parsing fails, keep the default value
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { variant: "secondary" as const, icon: Clock, label: "Under Review" },
            UNDER_REVIEW: { variant: "default" as const, icon: Clock, label: "In Review" },
            APPROVED: { variant: "default" as const, icon: CheckCircle2, label: "Approved" },
            REJECTED: { variant: "destructive" as const, icon: XCircle, label: "Rejected" },
            WAITLISTED: { variant: "outline" as const, icon: Clock, label: "Waitlisted" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center space-x-1">
                <IconComponent className="h-3 w-3" />
                <span>{config.label}</span>
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const typeConfig = {
            NEW: { variant: "default" as const, label: "New Student" },
            CONTINUING: { variant: "secondary" as const, label: "Continuing" },
            RETURNEE: { variant: "outline" as const, label: "Returnee" },
            TRANSFEREE: { variant: "default" as const, label: "Transferee" },
        };

        const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.NEW;

        return (
            <Badge variant={config.variant}>
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {applicant.user.firstName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track your application status and manage your information.
                    </p>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600 font-medium">
                        <GraduationCap className="h-4 w-4" />
                        <span>Applying for: {appliedGrade}</span>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    {getStatusBadge(applicant.status)}
                    {getTypeBadge(applicant.type)}
                </div>
            </div>

            {/* Application Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Grade Level</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appliedGrade}</div>
                        <p className="text-xs text-muted-foreground">
                            Applied grade level
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Application Number</CardTitle>
                        <Hash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicant.applicantNumber}</div>
                        <p className="text-xs text-muted-foreground">
                            Your unique identifier
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reference Code</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">{applicant.referenceCode}</div>
                        <p className="text-xs text-muted-foreground">
                            For inquiries
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Application Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(applicant.createdAt).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            When you applied
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Application Status */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Application Status</span>
                        </CardTitle>
                        <CardDescription>
                            Current status of your admission application for {appliedGrade}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-semibold">Application Review</h3>
                                <p className="text-sm text-gray-600">
                                    Your application for {appliedGrade} is being reviewed by our admissions team
                                </p>
                            </div>
                            {getStatusBadge(applicant.status)}
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Application Details:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Applicant Name:</span>
                                    <span className="font-medium">{applicant.user.firstName} {applicant.user.lastName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Grade Level:</span>
                                    <span className="font-medium">{appliedGrade}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Application Type:</span>
                                    <span className="font-medium">{applicant.type.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Application Date:</span>
                                    <span className="font-medium">{new Date(applicant.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Next Steps:</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {applicant.status === "PENDING" && (
                                    <>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Initial review by admissions team</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <span>Document verification</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <span>Final decision</span>
                                        </li>
                                    </>
                                )}
                                {applicant.status === "UNDER_REVIEW" && (
                                    <>
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>Initial review completed</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Document verification in progress</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <span>Final decision pending</span>
                                        </li>
                                    </>
                                )}
                                {applicant.status === "APPROVED" && (
                                    <>
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>Application approved for {appliedGrade}</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>All verifications completed</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Awaiting enrollment instructions</span>
                                        </li>
                                    </>
                                )}
                                {applicant.status === "REJECTED" && (
                                    <>
                                        <li className="flex items-center space-x-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            <span>Application not approved</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <span>Contact admissions for details</span>
                                        </li>
                                    </>
                                )}
                                {applicant.status === "WAITLISTED" && (
                                    <>
                                        <li className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-yellow-500" />
                                            <span>Placed on waitlist for {appliedGrade}</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <span>Awaiting available spots</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Manage your application
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button asChild className="w-full justify-start">
                            <Link href="/applicant/portal/application">
                                <FileText className="h-4 w-4 mr-2" />
                                View Full Application
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/applicant/portal/profile">
                                <User className="h-4 w-4 mr-2" />
                                Update Profile
                            </Link>
                        </Button>

                        <div className="pt-4 border-t">
                            <h4 className="font-medium text-sm mb-2">Application Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Grade:</span>
                                    <span className="font-medium">{appliedGrade}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-medium">{applicant.status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium">{applicant.type.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="font-medium text-sm mb-2">Need Help?</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Contact our admissions office for assistance with your application.
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                                Contact Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}