import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Accordion } from "@/components/ui/accordion";
import CreateUserButton from "@/components/admin/CreateUserButton";
import UserAccordionItem from "@/components/admin/UserAccordionItem";

export default async function AdminDashboard() {
    const session = await requireSession(["ADMIN"]);

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            gender: true,
            address: true,
            phoneNumber: true,
            birthdate: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return (
        <main className="space-y-8 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">
                        Welcome, {session.user.firstName} {session.user.lastName}!
                    </p>
                </div>
                <CreateUserButton />
            </div>

            {/* User Table */}
            <section>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                    All Registered Users
                </h2>

                <div className="w-full border rounded-lg overflow-hidden shadow-sm bg-white">
                    {/* Header Row */}
                    <div
                        className="grid text-sm font-semibold text-blue-700 bg-blue-50 border-b"
                        style={{ gridTemplateColumns: "1.5fr 2fr 2fr 1fr 1fr" }} // ✅ matches row layout below
                    >
                        <div className="px-4 py-2">Full Name</div>
                        <div className="px-4 py-2">Email</div>
                        <div className="px-4 py-2">CUID</div>
                        <div className="px-4 py-2 text-center">Role</div>
                        <div className="px-4 py-2 text-right">Actions</div>
                    </div>

                    {/* User Rows */}
                    <Accordion type="single" collapsible>
                        {users.map((user) => (
                            <UserAccordionItem key={user.id} user={user} />
                        ))}
                    </Accordion>
                </div>
            </section>
        </main>
    );
}
