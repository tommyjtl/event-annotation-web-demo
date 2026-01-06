import React from "react";
import { Modal } from "@/components/ui";

interface ImportProgressModalProps {
    isOpen: boolean;
    progress: number;
    fileName?: string;
    currentStep: string;
    totalItems?: number;
    processedItems?: number;
}

export default function ImportProgressModal({
    isOpen,
    // Import progress specific arguments
    progress,
    fileName,
    currentStep,
    totalItems,
    processedItems
}: ImportProgressModalProps) {

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                // empty cuz we are preventing closing during import
            }}
            title="Importing Events"
            showCloseButton={false}
            closeOnEscape={false}
            maxWidth="max-w-md"
        >
            <div className="space-y-4">
                {/* File name */}
                {fileName && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">
                            File:
                        </span> {fileName}
                    </div>
                )}

                {/* Current step */}
                <div className="text-sm text-gray-700">
                    {currentStep}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Progress text */}
                <div className="flex justify-between text-xs text-gray-500">
                    <span>
                        {Math.round(progress)}% complete
                    </span>
                    { // if total items and processed items are defined, then show them
                        totalItems &&
                        processedItems !== undefined &&
                        (
                            <span>{processedItems} of {totalItems} items</span>
                        )
                    }
                </div>

                {/* Loading spinner */}
                <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
            </div>
        </Modal>
    );
}
