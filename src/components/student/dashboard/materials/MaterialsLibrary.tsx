"use client";

import { useState } from "react";
import { LearningMaterial, MaterialType } from "@prisma/client";

interface MaterialWithClass extends LearningMaterial {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

interface MaterialsLibraryProps {
    materialsByClass: Record<string, MaterialWithClass[]>;
}

export function MaterialsLibrary({ materialsByClass }: MaterialsLibraryProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<MaterialType | "all">("all");
    const [selectedClass, setSelectedClass] = useState<string>("all");

    const getMaterialIcon = (type: MaterialType) => {
        switch (type) {
            case 'VIDEO': return '🎬';
            case 'IMAGE': return '🖼️';
            case 'DOCUMENT': return '📄';
            case 'LINK': return '🔗';
            default: return '📎';
        }
    };

    const getMaterialColor = (type: MaterialType) => {
        switch (type) {
            case 'VIDEO': return 'bg-red-100 text-red-600 border-red-200';
            case 'IMAGE': return 'bg-green-100 text-green-600 border-green-200';
            case 'DOCUMENT': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'LINK': return 'bg-purple-100 text-purple-600 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getMaterialTypeText = (type: MaterialType) => {
        switch (type) {
            case 'VIDEO': return 'Video';
            case 'IMAGE': return 'Image';
            case 'DOCUMENT': return 'Document';
            case 'LINK': return 'Web Link';
            default: return 'Resource';
        }
    };

    const getFileType = (url: string) => {
        if (url.includes('.pdf')) return 'PDF';
        if (url.includes('.doc') || url.includes('.docx')) return 'Word';
        if (url.includes('.mp4') || url.includes('.mov')) return 'Video';
        if (url.includes('.jpg') || url.includes('.png') || url.includes('.gif')) return 'Image';
        return 'File';
    };

    // Flatten and filter materials
    const allMaterials = Object.entries(materialsByClass).flatMap(([className, materials]) =>
        materials.map(material => ({ ...material, className }))
    );

    const filteredMaterials = allMaterials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || material.type === selectedType;
        const matchesClass = selectedClass === "all" || material.className === selectedClass;

        return matchesSearch && matchesType && matchesClass;
    });

    const classNames = Object.keys(materialsByClass);
    const materialTypes: { value: MaterialType | "all"; label: string; count: number }[] = [
        { value: "all", label: "All Types", count: allMaterials.length },
        { value: "VIDEO", label: "Videos", count: allMaterials.filter(m => m.type === 'VIDEO').length },
        { value: "DOCUMENT", label: "Documents", count: allMaterials.filter(m => m.type === 'DOCUMENT').length },
        { value: "IMAGE", label: "Images", count: allMaterials.filter(m => m.type === 'IMAGE').length },
        { value: "LINK", label: "Links", count: allMaterials.filter(m => m.type === 'LINK').length },
    ];

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as MaterialType | "all")}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {materialTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label} ({type.count})
                            </option>
                        ))}
                    </select>

                    {/* Class Filter */}
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Classes</option>
                        {classNames.map(className => (
                            <option key={className} value={className}>
                                {className}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="p-6">
                {filteredMaterials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start space-x-3 mb-3">
                                    <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center text-xl border ${getMaterialColor(material.type)}`}>
                                        {getMaterialIcon(material.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                                            {material.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 mb-1">
                                            {material.className}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {material.class.teacher.user.firstName} {material.class.teacher.user.lastName}
                                        </p>
                                    </div>
                                </div>

                                {material.description && (
                                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                        {material.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                    <span className={`px-2 py-1 rounded-full ${getMaterialColor(material.type)}`}>
                                        {getMaterialTypeText(material.type)}
                                    </span>
                                    <span>
                                        {new Date(material.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex space-x-2">
                                    <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                    >
                                        {material.type === 'VIDEO' ? 'Watch' :
                                            material.type === 'IMAGE' ? 'View' :
                                                material.type === 'LINK' ? 'Visit' : 'Open'}
                                    </a>

                                    {material.type === 'DOCUMENT' && (
                                        <a
                                            href={material.url}
                                            download
                                            className="px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                                        >
                                            Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                        <p className="text-gray-500">
                            {searchTerm || selectedType !== "all" || selectedClass !== "all"
                                ? "Try adjusting your filters"
                                : "No learning materials available yet"
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}