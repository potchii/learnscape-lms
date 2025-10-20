import { LearningMaterial, MaterialType } from "@prisma/client";

interface LearningMaterialsProps {
    materials: LearningMaterial[];
    classId: string;
}

export function LearningMaterials({ materials, classId }: LearningMaterialsProps) {
    const getMaterialIcon = (type: MaterialType) => {
        switch (type) {
            case 'VIDEO': return '🎬';
            case 'IMAGE': return '🖼️';
            case 'DOCUMENT': return '📄';
            case 'LINK': return '🔗';
            default: return '📎';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Learning Materials</h2>
                <p className="text-sm text-gray-600 mt-1">Fun resources to help you learn</p>
            </div>

            <div className="p-6">
                {materials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {materials.map((material) => (
                            <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="text-2xl">{getMaterialIcon(material.type)}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{material.title}</h3>
                                        {material.description && (
                                            <p className="text-gray-600 text-sm mt-1">{material.description}</p>
                                        )}
                                        <a href={material.url} target="_blank" rel="noopener noreferrer"
                                            className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                                            Open
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No learning materials yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}