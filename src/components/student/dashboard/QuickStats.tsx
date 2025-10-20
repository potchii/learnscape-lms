interface Class {
    id: string;
    name: string;
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    resourceCount: number;
}

interface QuickStatsProps {
    classes: Class[];
}

export function QuickStats({ classes }: QuickStatsProps) {
    const totalClasses = classes.length;
    const totalAssignments = classes.reduce((sum, classItem) => sum + classItem.totalAssignments, 0);
    const submittedAssignments = classes.reduce((sum, classItem) => sum + classItem.submittedAssignments, 0);
    const averageProgress = classes.length > 0
        ? classes.reduce((sum, classItem) => sum + classItem.progress, 0) / classes.length
        : 0;

    const stats = [
        {
            name: 'My Classes',
            value: totalClasses,
            description: 'Subjects you study',
            color: 'blue',
            icon: '🏫',
        },
        {
            name: 'Homework',
            value: totalAssignments,
            description: 'Total assigned',
            color: 'green',
            icon: '📝',
        },
        {
            name: 'Completed',
            value: submittedAssignments,
            description: 'Work finished',
            color: 'purple',
            icon: '✅',
        },
        {
            name: 'Progress',
            value: `${Math.round(averageProgress)}%`,
            description: 'Overall done',
            color: 'orange',
            icon: '📈',
        },
    ];

    const getColorClasses = (color: string) => {
        const colorMap: { [key: string]: string } = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
        };
        return colorMap[color] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.name}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl ${getColorClasses(stat.color)}`}>
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}