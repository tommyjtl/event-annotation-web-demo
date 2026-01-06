import React from "react";

// Import global components and utilities
import { KeyboardShortcuts } from "@/store/keyboardShortcuts";
import { Modal } from "@/components/ui";

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function KeyboardShortcutsModal({
    isOpen, onClose
}: KeyboardShortcutsModalProps) {
    const footerContent = (
        <p className="text-xs text-gray-500 text-center">
            Press
            <kbd className="px-1 py-0.5 text-xs font-mono bg-gray-200 border border-gray-300 rounded mx-1">
                ⌘ + /
            </kbd>
            to open shortcuts or
            <kbd className="px-1 py-0.5 text-xs font-mono bg-gray-200 border border-gray-300 rounded mx-1">
                Escape
            </kbd>
            to close this modal
        </p>
    );

    const mainContent = (
        <div className="space-y-6">
            {KeyboardShortcuts.map((category, index) => (
                <div key={index}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        {category.category}
                    </h3>
                    <div className="space-y-2">
                        {category.shortcuts.map((shortcut, shortcutIndex) => (
                            <div key={shortcutIndex} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{shortcut.description}</span>
                                <kbd className={
                                    `px-2 py-1 text-xs font-mono bg-gray-100 
                                    border border-gray-300 rounded`
                                }>
                                    {shortcut.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Keyboard Shortcuts"
            footer={footerContent}
        >
            {mainContent}
        </Modal>
    );
}
