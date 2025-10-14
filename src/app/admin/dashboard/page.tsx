import { requireSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";


export default async function AdminDashboard() {
    const session = await requireSession(["ADMIN"]); //  explicitly tell TS to return Session || Null;

    return (
        <main>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p>Welcome, {session.user.firstName} {session.user.lastName}!</p>
            <LogoutButton />
        </main>
    );
}
