// app/teacher/dashboard/page.tsx
import { requireSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function TeacherDashboard() {
    const session = await requireSession(["TEACHER", "ADMIN"]);

    return (
        <main className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-gray-600">
                Welcome, {session.user.firstName} {session.user.lastName}! 👋
            </p>
            <LogoutButton />

            <section className="grid gap-6 sm:grid-cols-2">
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Your Classes</h2>
                    <p className="text-sm text-gray-600">
                        View and manage the subjects you’re teaching this semester.
                    </p>
                </div>

                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Attendance Logs</h2>
                    <p className="text-sm text-gray-600">
                        Record and review student attendance for each class.
                    </p>
                </div>

                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Grades & Reports</h2>
                    <p className="text-sm text-gray-600">
                        Input or update student grades and generate performance reports.
                    </p>
                </div>
            </section>
        </main>
    );
}
