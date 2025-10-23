// src/app/login/page.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/lib/validators";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    School,
    Mail,
    Lock,
    Eye,
    EyeOff,
    BookOpen,
    Users,
    GraduationCap,
    Sparkles,
    User
} from "lucide-react";
import { useState } from "react";

// Client-side redirect function
function redirectToDashboard(role: string) {
    const routes: { [key: string]: string } = {
        'APPLICANT': '/applicant/portal',
        'STUDENT': '/student/dashboard',
        'PARENT': '/parent/dashboard',
        'TEACHER': '/teacher/dashboard',
        'ADMIN': '/admin/dashboard',
    };
    return routes[role] || '/';
}

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const message = searchParams.get('message');
    const error = searchParams.get('error');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (values: LoginInput) => {
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: values.emailOrUsername,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                setError('root', { message: 'Invalid email or password' });
            } else {
                // Get the session to determine user role and redirect appropriately
                try {
                    const response = await fetch('/api/auth/session');
                    const session = await response.json();

                    if (session?.user?.role) {
                        // Use client-side redirect function
                        const redirectPath = redirectToDashboard(session.user.role);
                        router.push(redirectPath);
                    } else {
                        // Fallback to home page if role not found
                        router.push('/');
                    }
                } catch (sessionError) {
                    console.error('Error fetching session:', sessionError);
                    router.push('/');
                }
            }
        } catch (error) {
            setError('root', { message: 'An error occurred during login' });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding and Features */}
                <div className="hidden lg:block space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <School className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    LearnScape
                                </h1>
                                <p className="text-gray-600 text-sm">Brightfield Primary School</p>
                            </div>
                        </div>

                        <p className="text-xl text-gray-700 leading-relaxed">
                            Welcome back to your educational journey. Access your personalized learning portal and continue where you left off.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Student Portal</h3>
                                <p className="text-sm text-gray-600">Access assignments, grades, and learning materials</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Parent Dashboard</h3>
                                <p className="text-sm text-gray-600">Monitor your child's progress and school activities</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Teacher Tools</h3>
                                <p className="text-sm text-gray-600">Manage classes, assignments, and student progress</p>
                            </div>
                        </div>

                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">500+</div>
                            <div className="text-xs text-gray-600">Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">40+</div>
                            <div className="text-xs text-gray-600">Teachers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">6</div>
                            <div className="text-xs text-gray-600">Grade Levels</div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex justify-center lg:justify-end">
                    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center space-y-4 pb-6">
                            <div className="flex justify-center lg:hidden">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <School className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Welcome Back
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Sign in to your LearnScape account
                                </CardDescription>
                            </div>

                            {/* Success Message */}
                            {message === 'signup_success' && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center space-x-2 text-green-700">
                                        <Sparkles className="h-4 w-4" />
                                        <span className="text-sm font-medium">Account created successfully! Please sign in.</span>
                                    </div>
                                </div>
                            )}

                            {/* Error Message from URL */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center space-x-2 text-red-700">
                                        <span className="text-sm font-medium">Authentication failed. Please try again.</span>
                                    </div>
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Email/Username Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="emailOrUsername" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            {...register("emailOrUsername")}
                                            type="text"
                                            placeholder="Enter your email address"
                                            className="pl-10 pr-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        />
                                    </div>
                                    {errors.emailOrUsername && (
                                        <p className="text-red-500 text-sm">{errors.emailOrUsername.message}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            {...register("password")}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="pl-10 pr-12 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

                                {/* Form Error */}
                                {errors.root && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm text-center">{errors.root.message}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        <span>Sign In</span>
                                    )}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">New to LearnScape?</span>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <Button asChild variant="outline" className="w-full border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <Link href="/signup" className="flex items-center justify-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>Create Applicant Account</span>
                                    </Link>
                                </Button>
                            </div>

                            {/* Quick Info */}
                            <div className="text-center space-y-2">
                                <p className="text-xs text-gray-500">
                                    Secure login powered by NextAuth.js
                                </p>
                                <p className="text-xs text-gray-500">
                                    © {new Date().getFullYear()} LearnScape LMS. All rights reserved.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
                <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
            </div>
        </div>
    );
}