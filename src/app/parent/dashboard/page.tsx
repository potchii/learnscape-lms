// app/parent/dashboard/page.tsx
import { requireSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";


export default async function ParentDashboard() {
    // Allow only PARENT
    const session = await requireSession(["PARENT", "ADMIN"]);

    return (
        <main className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Parent Dashboard</h1>
            <p className="text-gray-600">
                Welcome, {session.user.firstName} {session.user.lastName}! 👋
            </p>
            <LogoutButton />

            <section className="grid gap-6 sm:grid-cols-2">
                {/* Child Progress Overview */}
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Child Progress</h2>
                    <p className="text-sm text-gray-600">
                        View grades, attendance, and overall academic performance for your child.
                    </p>
                </div>

                {/* Announcements */}
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Announcements</h2>
                    <p className="text-sm text-gray-600">
                        Stay informed about upcoming events, meetings, and important notices.
                    </p>
                </div>

                {/* Messages */}
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Messages</h2>
                    <p className="text-sm text-gray-600">
                        Communicate directly with teachers and school staff.
                    </p>
                </div>
            </section>
        </main>
    );
}
