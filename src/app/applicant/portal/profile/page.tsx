// src/app/applicant/portal/profile/page.tsx
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default async function ProfilePage() {
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
                                Profile Not Found
                            </h2>
                            <p className="text-gray-600">
                                We couldn't find your profile information.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-2">
                    View and manage your personal information
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                        Your basic information used for the application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">First Name</label>
                                <p className="mt-1 font-semibold">{applicant.user.firstName}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Middle Name</label>
                                <p className="mt-1 font-semibold">
                                    {applicant.user.middleName || "Not provided"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Name</label>
                                <p className="mt-1 font-semibold">{applicant.user.lastName}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Gender</label>
                                <p className="mt-1 font-semibold capitalize">{applicant.user.gender.toLowerCase()}</p>
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

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>Phone Number</span>
                                </label>
                                <p className="mt-1 font-semibold">
                                    {applicant.user.phoneNumber || "Not provided"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Birthdate</span>
                                </label>
                                <p className="mt-1 font-semibold">
                                    {new Date(applicant.user.birthdate).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>Address</span>
                                </label>
                                <p className="mt-1 font-semibold">{applicant.user.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-4">
                            To update your personal information, please contact the admissions office.
                        </p>
                        <Button variant="outline">
                            Contact Support for Updates
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}