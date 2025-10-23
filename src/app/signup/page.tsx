// src/app/signup/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { School, Eye, EyeOff } from "lucide-react";

const SignupSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.enum(["MALE", "FEMALE"]),
    birthdate: z.string().min(1, "Birthdate is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupInput = z.infer<typeof SignupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<SignupInput>({
        resolver: zodResolver(SignupSchema),
    });

    const onSubmit = async (data: SignupInput) => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    middleName: data.middleName || null,
                    lastName: data.lastName,
                    gender: data.gender,
                    birthdate: new Date(data.birthdate).toISOString(),
                    address: data.address,
                    phoneNumber: data.phoneNumber || null,
                    role: "APPLICANT",
                }),
            });

            const result = await response.json();

            if (response.ok) {
                router.push('/login?message=signup_success');
            } else {
                setError('root', {
                    message: result.error || 'Signup failed. Please try again.'
                });
            }
        } catch (error) {
            setError('root', {
                message: 'Network error. Please try again.'
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <School className="h-8 w-8 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold text-gray-900">LearnScape</span>
                    </div>
                    <CardTitle className="text-2xl">Apply as Student Applicant</CardTitle>
                    <CardDescription>
                        Create your applicant account to start the enrollment process for Brightfield Primary School
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    {...register("firstName")}
                                    type="text"
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="middleName">Middle Name</Label>
                                <Input
                                    {...register("middleName")}
                                    type="text"
                                    placeholder="Enter your middle name (optional)"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                {...register("lastName")}
                                type="text"
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <select
                                    {...register("gender")}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm">Please select your gender</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthdate">Birthdate *</Label>
                                <Input
                                    {...register("birthdate")}
                                    type="date"
                                />
                                {errors.birthdate && (
                                    <p className="text-red-500 text-sm">{errors.birthdate.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                {...register("phoneNumber")}
                                type="tel"
                                placeholder="Enter your phone number (optional)"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                                {...register("address")}
                                type="text"
                                placeholder="Enter your complete address"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm">{errors.address.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <div className="relative">
                                    <Input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <div className="relative">
                                    <Input
                                        {...register("confirmPassword")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Applicant Notice */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> This account is for student applicants only.
                                After signing up, your application will be reviewed by our administration team.
                                You will be notified once your application is approved and your student account is created.
                            </p>
                        </div>

                        {/* Error Message */}
                        {errors.root && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 text-sm">{errors.root.message}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting Application..." : "Submit Application"}
                        </Button>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-600 hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}