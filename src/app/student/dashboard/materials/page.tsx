import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { MaterialsLibrary } from "@/components/student/dashboard/materials/MaterialsLibrary";

export default async function StudentMaterialsPage() {
    const session = await requireSession(["STUDENT", "ADMIN"]);

    const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
            section: true,
        },
    });

    if (!student) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-800">Student Record Not Found</h2>
                    <p className="text-red-600">We couldn't find your student information.</p>
                </div>
            </div>
        );
    }

    // Get all learning materials for the student's classes
    const materials = await prisma.learningMaterial.findMany({
        where: {
            class: {
                sectionId: student.sectionId,
            },
        },
        include: {
            class: {
                select: {
                    subjectName: true,
                    teacher: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Group materials by class
    const materialsByClass = materials.reduce((acc, material) => {
        const className = material.class.subjectName;
        if (!acc[className]) {
            acc[className] = [];
        }
        acc[className].push(material);
        return acc;
    }, {} as Record<string, typeof materials>);

    // Get material statistics
    const totalMaterials = materials.length;
    const videoCount = materials.filter(m => m.type === 'VIDEO').length;
    const documentCount = materials.filter(m => m.type === 'DOCUMENT').length;
    const imageCount = materials.filter(m => m.type === 'IMAGE').length;
    const linkCount = materials.filter(m => m.type === 'LINK').length;

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <Link
                        href="/student/dashboard"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
                <p className="text-gray-600">
                    Resources and materials from all your classes
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalMaterials}</div>
                    <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{videoCount}</div>
                    <div className="text-sm text-gray-600">Videos</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{documentCount}</div>
                    <div className="text-sm text-gray-600">Documents</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{imageCount}</div>
                    <div className="text-sm text-gray-600">Images</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{linkCount}</div>
                    <div className="text-sm text-gray-600">Links</div>
                </div>
            </div>

            <MaterialsLibrary materialsByClass={materialsByClass} />
        </div>
    );
}