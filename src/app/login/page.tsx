'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/lib/validators";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const router = useRouter();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { emailOrUsername: "", password: "" },
    });

    const onSubmit = async (values: LoginInput) => {
        const result = await signIn("credentials", {
            email: values.emailOrUsername,
            password: values.password,
            redirect: false,
        });

        if (result?.error) {
            setError("root", { message: "Invalid email or password." });
            return;
        }

        const session = await getSession();
        const role = (session as any)?.user?.role;

        switch (role) {
            case "ADMIN": router.push("/admin"); break;
            case "TEACHER": router.push("/teacher"); break;
            case "PARENT": router.push("/parent"); break;
            case "STUDENT": router.push("/student"); break;
            default: router.push("/dashboard"); break;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Card className="w-[380px]">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Welcome to LearnScape</CardTitle>
                    <CardDescription>Sign in with your email and password.</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="emailOrUsername">Email</Label>
                            <Input id="emailOrUsername" type="text" placeholder="name@example.com" {...register("emailOrUsername")} />
                            {errors.emailOrUsername && (
                                <p className="text-sm font-medium text-red-500">{errors.emailOrUsername.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {errors.root && (
                            <p className="text-sm font-medium text-center text-red-500">{errors.root.message}</p>
                        )}
                    </CardContent>

                    <CardFooter>
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
