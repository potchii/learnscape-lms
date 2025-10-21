// src/components/Footer.tsx
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="text-center text-sm text-gray-600">
                    <p>Copyright © LearnScape {currentYear}. Developed by Nez.</p>
                </div>
            </div>
        </footer>
    );
}