import React, { useEffect, useState } from "react";

// Import global components and utilities
import { CloseIcon } from "@/components/ui/icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = "max-w-md",
    closeOnEscape = true,
    showCloseButton = true,
}: ModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    // Handle modal visibility and rendering
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 10); // allow render before fade in
        } else {
            setIsVisible(false);
            // Wait for fadeout before removing from DOM
            const timeout = setTimeout(() => setShouldRender(false), 200); // match duration-200
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, closeOnEscape]);

    // If modal is not open and should not render, return null
    if (!shouldRender) return null;

    return (
        <div
            className={
                `fixed inset-0 bg-black/50 flex 
                items-center justify-center z-50 
                transition-opacity duration-200 ease-out 
                ${isVisible ?
                    'opacity-100 pointer-events-auto'
                    :
                    'opacity-0 pointer-events-none'
                }`}
            onClick={onClose}
        >
            <div
                className={`
                    bg-white rounded-lg shadow-xl 
                    ${maxWidth} w-full mx-4 max-h-[80vh] 
                    overflow-y-auto transform transition-all 
                    duration-200 ease-out 
                    ${isVisible ?
                        'scale-100 opacity-100 translate-y-0'
                        :
                        'scale-95 opacity-0 translate-y-4'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        {title && (
                            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
