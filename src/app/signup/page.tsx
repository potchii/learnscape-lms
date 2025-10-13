'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    firstName: z.string().min(1, "First name required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name required"),
    gender: z.enum(["MALE", "FEMALE"]),
    birthdate: z.string().optional(),
    address: z.string().optional(),
});

type SignupInput = z.infer<typeof SignupSchema>;

const SignupPage = () => {
    const router = useRouter();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
        useForm<SignupInput>({ resolver: zodResolver(SignupSchema) });

    const onSubmit = async (data: SignupInput) => {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const { error } = await res.json();
            setError("root", { message: error || "Error creating account." });
            return;
        }

        router.push("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-3">
                        <Label>Email</Label>
                        <Input type="email" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

                        <Label>Password</Label>
                        <Input type="password" {...register("password")} />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

                        <Label>First Name</Label>
                        <Input type="text" {...register("firstName")} />
                        <Label>Middle Name</Label>
                        <Input type="text" {...register("middleName")} />
                        <Label>Last Name</Label>
                        <Input type="text" {...register("lastName")} />

                        <Label>Gender</Label>
                        <select className="border rounded p-2" {...register("gender")}>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>

                        <Label>Birthdate</Label>
                        <Input type="date" {...register("birthdate")} />

                        <Label>Address</Label>
                        <Input type="text" {...register("address")} />

                        {errors.root && <p className="text-sm text-center text-red-500">{errors.root.message}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Sign Up"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default SignupPage;
