import { requireSession } from "@/lib/session";

export default async function ParentAssignmentsPage() {
    await requireSession(['PARENT']);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                <p className="text-gray-600 mt-2">Track academic work and submissions</p>

                <div className="mt-8 bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">Assignments page - Coming soon</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Comprehensive assignment tracking and grade monitoring
                    </p>
                </div>
            </div>
        </div>
    );
}