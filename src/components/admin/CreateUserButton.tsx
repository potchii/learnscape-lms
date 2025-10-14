"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateUserButton() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "APPLICANT",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setOpen(false);
            window.location.reload(); // reload table
        } else {
            alert("Error creating user");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">+ Create New User</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div>
                        <Label>First Name</Label>
                        <Input name="firstName" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Last Name</Label>
                        <Input name="lastName" value={form.lastName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Password</Label>
                        <Input type="password" name="password" value={form.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Role</Label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="TEACHER">TEACHER</option>
                            <option value="PARENT">PARENT</option>
                            <option value="STUDENT">STUDENT</option>
                            <option value="APPLICANT">APPLICANT</option>
                        </select>
                    </div>

                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Create User
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
