// src/app/teacher/classes/[classId]/materials/page.tsx
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import { File, Image, Video, Link as LinkIcon, Download, Eye, Plus } from 'lucide-react';

interface Props {
    params: Promise<{
        classId: string;
    }>;
}

export default async function MaterialsPage({ params }: Props) {
    const session = await requireSession(["TEACHER"]);
    const { classId } = await params;

    const classData = await prisma.class.findUnique({
        where: {
            id: classId,
            teacher: {
                userId: session.user.id,
            },
        },
        include: {
            section: {
                select: {
                    gradeLevel: true,
                    name: true,
                },
            },
            learningMaterials: {
                include: {
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
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!classData) {
        return <div>Class not found or you don't have access to it.</div>;
    }

    const getMaterialIcon = (type: string) => {
        switch (type) {
            case 'DOCUMENT': return <File className="w-5 h-5" />;
            case 'IMAGE': return <Image className="w-5 h-5" />;
            case 'VIDEO': return <Video className="w-5 h-5" />;
            case 'LINK': return <LinkIcon className="w-5 h-5" />;
            default: return <File className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'DOCUMENT': return 'bg-blue-100 text-blue-800';
            case 'IMAGE': return 'bg-green-100 text-green-800';
            case 'VIDEO': return 'bg-purple-100 text-purple-800';
            case 'LINK': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
                        <p className="text-gray-600 mt-2">
                            {classData.subjectName}
                            {classData.section && (
                                <> - Grade {classData.section.gradeLevel} - {classData.section.name}</>
                            )}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {classData.learningMaterials.length} material{classData.learningMaterials.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link
                        href={`/teacher/classes/${classId}/materials/new`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Material
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classData.learningMaterials.map((material) => (
                    <div
                        key={material.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {getMaterialIcon(material.type)}
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                                    {material.type.toLowerCase()}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(material.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {material.title}
                        </h3>

                        {material.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {material.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-xs text-gray-500">
                                By {material.teacher.user.firstName} {material.teacher.user.lastName}
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="View"
                                >
                                    <Eye className="w-4 h-4" />
                                </a>
                                {(material.type === 'DOCUMENT' || material.type === 'IMAGE') && (
                                    <a
                                        href={material.url}
                                        download
                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {classData.learningMaterials.length === 0 && (
                <div className="text-center py-12">
                    <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No learning materials yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first learning material</p>
                    <Link
                        href={`/teacher/classes/${classId}/materials/new`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Your First Material
                    </Link>
                </div>
            )}
        </div>
    );
}