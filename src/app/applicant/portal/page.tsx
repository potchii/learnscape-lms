// app/applicant/portal/page.tsx
import { requireSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";


export default async function ApplicantPortal() {
    // Allow only APPLICANT role
    const session = await requireSession(["APPLICANT", "ADMIN"]);

    return (
        <main className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Applicant Portal</h1>
            <p className="text-gray-600">
                Hello, {session.user.firstName} {session.user.lastName}! 👋
                <LogoutButton />
            </p>

            <section className="grid gap-6 sm:grid-cols-2">
                {/* Application Status */}
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Application Status</h2>
                    <p className="text-sm text-gray-600">
                        Check your application progress and admission decision updates.
                    </p>
                </div>

                {/* Document Submission */}
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Documents</h2>
                    <p className="text-sm text-gray-600">
                        Upload or review your submitted documents required for enrollment.
                    </p>
                </div>

                {/* Support / Contact */}
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Support</h2>
                    <p className="text-sm text-gray-600">
                        Need help with your application? Contact our admissions team here.
                    </p>
                </div>
            </section>
        </main>
    );
}
