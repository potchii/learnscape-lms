"use client";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";
import RoleSelector from "@/components/admin/RoleSelector";
import { cn } from "@/lib/utils";

interface UserAccordionItemProps {
    user: {
        id: string;
        firstName: string;
        middleName?: string | null;
        lastName: string;
        email: string;
        gender?: string | null;
        address?: string | null;
        phoneNumber?: string | null;
        birthdate?: Date | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

export default function UserAccordionItem({ user }: UserAccordionItemProps) {
    const [open, setOpen] = useState(false);

    return (
        <AccordionItem value={user.id} className="border-b last:border-none">
            {/* Table Row */}
            <div
                className="grid items-center text-sm text-gray-800 px-4 py-2 hover:bg-blue-50 transition-colors"
                style={{ gridTemplateColumns: "1.5fr 2fr 2fr 1fr 1fr" }} // ✅ matches header
            >
                {/* Full Name */}
                <div className="truncate">{user.firstName} {user.lastName}</div>

                {/* Email */}
                <div className="truncate">{user.email}</div>

                {/* CUID */}
                <div className="truncate text-xs text-gray-500">{user.id}</div>

                {/* Role Selector */}
                <div className="flex justify-center">
                    <RoleSelector userId={user.id} currentRole={user.role} />
                </div>

                {/* View Details Trigger */}
                <div className="flex justify-end items-center">
                    <AccordionTrigger
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen((prev) => !prev);
                        }}
                        className="flex items-center gap-1 text-blue-600 underline hover:text-blue-800 cursor-pointer select-none"
                    >
                        {open ? "Hide Details" : "View Details"}
                    </AccordionTrigger>
                </div>
            </div>

            {/* Accordion Content */}
            <AccordionContent
                className={cn(
                    "bg-gray-50 text-sm overflow-hidden transition-all duration-500 ease-in-out px-6 py-3 grid grid-cols-2 gap-3 border-t"
                )}
            >
                <div>
                    <p><span className="font-semibold">Full Name:</span> {user.firstName} {user.middleName ?? ""} {user.lastName}</p>
                    <p><span className="font-semibold">Phone:</span> {user.phoneNumber ?? "—"}</p>
                    <p><span className="font-semibold">Gender:</span> {user.gender ?? "—"}</p>
                    <p><span className="font-semibold">Birthdate:</span> {user.birthdate?.toISOString().split("T")[0] ?? "—"}</p>
                    <p><span className="font-semibold">Address:</span> {user.address ?? "—"}</p>
                </div>

                <div>
                    <p><span className="font-semibold">Email:</span> {user.email}</p>
                    <p><span className="font-semibold">Role:</span> {user.role}</p>
                    <p><span className="font-semibold">Created At:</span> {user.createdAt.toISOString()}</p>
                    <p><span className="font-semibold">Updated At:</span> {user.updatedAt.toISOString()}</p>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
