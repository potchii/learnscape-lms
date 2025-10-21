// src/app/student/subjects/[id]/SubjectNavigation.tsx
"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface SubjectNavigationProps {
    classId: string;
}

export function SubjectNavigation({ classId }: SubjectNavigationProps) {
    const params = useParams();
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop() || 'content';

    const tabs = [
        { id: 'content', label: 'Subject Content', icon: '📚' },
        { id: 'participants', label: 'Participants', icon: '👥' },
        { id: 'grades', label: 'Grades', icon: '📊' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={`/student/subjects/${classId}/${tab.id === 'content' ? '' : tab.id}`}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${currentTab === tab.id || (tab.id === 'content' && currentTab === classId)
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}