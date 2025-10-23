// src/app/applicant/portal/application/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Hash,
    FileText,
    Clock,
    GraduationCap
} from "lucide-react";

// Helper function to parse personalInfo and get grade level
function getAppliedGrade(personalInfo: string | null): string {
    if (!personalInfo) return "Not specified";

    try {
        const parsedInfo = JSON.parse(personalInfo);

        // Check both possible field names
        if (parsedInfo.appliedGrade) {
            return parsedInfo.appliedGrade;
        }
        if (parsedInfo.gradeLevel) {
            // Convert grade level value to readable label
            const gradeLevels: { [key: string]: string } = {
                "KINDERGARTEN": "Kindergarten",
                "GRADE_1": "Grade 1",
                "GRADE_2": "Grade 2",
                "GRADE_3": "Grade 3",
                "GRADE_4": "Grade 4",
                "GRADE_5": "Grade 5",
                "GRADE_6": "Grade 6",
            };
            return gradeLevels[parsedInfo.gradeLevel] || parsedInfo.gradeLevel;
        }
        return "Not specified";
    } catch (error) {
        console.error('Error parsing personalInfo:', error);
        return "Not specified";
    }
}

export default async function ApplicationPage() {
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Application Not Found
                            </h2>
                            <p className="text-gray-600">
                                We couldn't find your application details.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const appliedGrade = getAppliedGrade(applicant.personalInfo);

    const calculateAge = (birthdate: Date) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
                <p className="text-gray-600 mt-2">
                    Complete information about your application
                </p>
                <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600 font-medium">
                    <GraduationCap className="h-4 w-4" />
                    <span>Applying for: <strong>{appliedGrade}</strong></span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Application Information */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Application Info</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Application Number</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <Hash className="h-4 w-4 text-gray-400" />
                                <span className="font-mono font-semibold">{applicant.applicantNumber}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Reference Code</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="font-mono font-semibold">{applicant.referenceCode}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Application Type</label>
                            <div className="mt-1">
                                <Badge variant="outline">
                                    {applicant.type.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Status</label>
                            <div className="mt-1">
                                <Badge variant={
                                    applicant.status === "APPROVED" ? "default" :
                                        applicant.status === "REJECTED" ? "destructive" :
                                            applicant.status === "UNDER_REVIEW" ? "default" :
                                                "secondary"
                                }>
                                    {applicant.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Applied On</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{new Date(applicant.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Last Updated</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{new Date(applicant.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information - Now includes Grade Level */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Personal Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="mt-1 font-semibold">
                                        {applicant.user.firstName}
                                        {applicant.user.middleName && ` ${applicant.user.middleName}`}
                                        {` ${applicant.user.lastName}`}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Gender</label>
                                    <p className="mt-1 font-semibold capitalize">{applicant.user.gender.toLowerCase()}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Birthdate & Age</label>
                                    <p className="mt-1 font-semibold">
                                        {new Date(applicant.user.birthdate).toLocaleDateString()}
                                        <span className="text-gray-600 ml-2">
                                            ({calculateAge(applicant.user.birthdate)} years old)
                                        </span>
                                    </p>
                                </div>

                                {/* Grade Level moved here */}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>Grade Level Applied For</span>
                                    </label>
                                    <p className="mt-1 font-semibold text-blue-600">{appliedGrade}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                                        <Mail className="h-4 w-4" />
                                        <span>Email Address</span>
                                    </label>
                                    <p className="mt-1 font-semibold">{applicant.user.email}</p>
                                </div>

                                {applicant.user.phoneNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                                            <Phone className="h-4 w-4" />
                                            <span>Phone Number</span>
                                        </label>
                                        <p className="mt-1 font-semibold">{applicant.user.phoneNumber}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>Address</span>
                                    </label>
                                    <p className="mt-1 font-semibold">{applicant.user.address}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Application Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Application Summary</CardTitle>
                    <CardDescription>
                        Overview of your application details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-1">
                            <div className="text-gray-500">Applicant Name</div>
                            <div className="font-semibold">{applicant.user.firstName} {applicant.user.lastName}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-gray-500">Grade Level</div>
                            <div className="font-semibold text-blue-600">{appliedGrade}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-gray-500">Application Type</div>
                            <div className="font-semibold">{applicant.type.replace('_', ' ')}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-gray-500">Current Status</div>
                            <div className="font-semibold">
                                <Badge variant={
                                    applicant.status === "APPROVED" ? "default" :
                                        applicant.status === "REJECTED" ? "destructive" :
                                            applicant.status === "UNDER_REVIEW" ? "default" :
                                                "secondary"
                                }>
                                    {applicant.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}