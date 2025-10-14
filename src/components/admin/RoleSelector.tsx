"use client";

import { useState } from "react";

export default function RoleSelector({ userId, currentRole }: { userId: string; currentRole: string }) {
    const [role, setRole] = useState(currentRole);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        setRole(newRole);

        await fetch(`/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
        });
    };

    return (
        <select
            value={role}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
        >
            {["ADMIN", "TEACHER", "PARENT", "STUDENT", "APPLICANT"].map((r) => (
                <option key={r} value={r}>
                    {r}
                </option>
            ))}
        </select>
    );
}
