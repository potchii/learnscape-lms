// Create: /src/components/teacher/MarkAllPresentButton.tsx
"use client";

interface MarkAllPresentButtonProps {
    classId: string;
}

export function MarkAllPresentButton({ classId }: MarkAllPresentButtonProps) {
    const markAllPresent = () => {
        const radioButtons = document.querySelectorAll(`input[type="radio"][value="PRESENT"]`);
        radioButtons.forEach((radio: any) => {
            radio.checked = true;
        });
    };

    return (
        <button
            type="button"
            onClick={markAllPresent}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
            Mark All Present
        </button>
    );
}