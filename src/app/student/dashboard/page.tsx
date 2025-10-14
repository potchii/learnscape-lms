// app/student/dashboard/page.tsx
import { requireSession } from "@/lib/session"
import LogoutButton from "@/components/LogoutButton";


export default async function StudentDashboard() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
            <p className="text-lg mb-4">
                Welcome back, {session.user.firstName} {session.user.lastName}!
                <LogoutButton />
            </p>

            <section className="mt-6 space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                    <h2 className="text-xl font-semibold mb-2">My Classes</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        You can view your current classes, assignments, and grades here soon.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                    <h2 className="text-xl font-semibold mb-2">Attendance</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Track your attendance and view daily summaries once data is available.
                    </p>
                </div>
            </section>
        </main>
    );
}
