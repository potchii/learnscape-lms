'use client';

import React from 'react';
// ShadCN components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// React Hook Form and Zod imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/lib/validators"; // Import the schema
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// ShadCN Form components (optional, but good for structured forms)
// Note: You would need to install these: npx shadcn-ui@latest add form form-item form-label form-control form-message

const LoginPage = () => {
    const router = useRouter();

    // 1. Initialize useForm with ZodResolver
    const form = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            emailOrUsername: "",
            password: "",
        },
    });

    const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

    // 2. Define the submission function
    const onSubmit = async (values: LoginInput) => {
        // Clear previous errors if any
        // setError('root.serverError', { message: '' });

        // T-1.3: Call NextAuth's signIn function
        const result = await signIn('credentials', {
            ...values,
            redirect: false, // Prevents automatic redirect on failure
        });

        if (result?.error) {
            // Handle authentication errors (e.g., wrong password/email)
            console.error("Login Error:", result.error);
            // In a real app, you would set a form error here.
        } else if (result?.ok) {
            // Success! Redirect user based on their role (e.g., to /student or /admin)
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Card className="w-[380px]">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Welcome to LearnScape</CardTitle>
                    <CardDescription>
                        Sign in with your email and password.
                    </CardDescription>
                </CardHeader>

                {/* 3. Wrap the form and use RHF's handleSubmit */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">

                        {/* Email / Username Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="emailOrUsername">Email or Username</Label>
                            <Input
                                id="emailOrUsername"
                                type="text"
                                placeholder="name@example.com"
                                // RHF registration maps input to schema field
                                {...register("emailOrUsername")}
                            />
                            {/* Display validation errors */}
                            {errors.emailOrUsername && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.emailOrUsername.message}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                // RHF registration maps input to schema field
                                {...register("password")}
                            />
                            {/* Display validation errors */}
                            {errors.password && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        {/* Disable button while submitting */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;