import React from "react";

// Import global components and utilities
import { FileUploadButton } from "@/components/ui";
import Button from "@/components/ui/general/Button";

interface TriageEmptyViewProps {
    onFileSelect: (file: File) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onLoadExample?: () => void;
}

export default function TriageEmptyView({ onFileSelect, inputRef, onLoadExample }: TriageEmptyViewProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
                <span className="mb-2 text-black-600 font-semibold">
                    Upload events
                </span>
                <FileUploadButton
                    onFileSelect={onFileSelect}
                    accept="application/json"
                    inputRef={inputRef}
                >
                    Choose file
                </FileUploadButton>
                <div className="flex items-center gap-3">
                    <div className="h-px bg-gray-300 w-12"></div>
                    <span className="text-gray-500 text-sm">or</span>
                    <div className="h-px bg-gray-300 w-12"></div>
                </div>
                <Button
                    onClick={onLoadExample}
                    variant="outline"
                >
                    Load example data
                </Button>
            </div>
        </div>
    );
}
