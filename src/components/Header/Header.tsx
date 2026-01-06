import React from "react";

// Import global components and utilities
import Button from "@/components/ui/general/Button";
import { useCommandKey } from "@/hooks/useKeyboardShortcut";
import { useModal } from "@/hooks/useModal";

// Import local components
import KeyboardShortcutsModal from "../ui/KeyboardShortcutsModal";

export default function Header() {
    const modal = useModal();

    useCommandKey('/', modal.toggle, [modal.isOpen]);

    return (
        <>
            <header className={`flex justify-between items-center 
                px-6 py-4 border-b border-gray-200 bg-white`
            }>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Event Annotation Tool</h1>
                </div>
                <div className="flex-1 flex justify-end">
                    <Button
                        onClick={modal.open}
                        variant="white"
                        size="sm"
                    >
                        Keyboard Shortcuts
                    </Button>
                </div>
            </header>

            <KeyboardShortcutsModal
                isOpen={modal.isOpen}
                onClose={modal.close}
            />
        </>
    );
}
