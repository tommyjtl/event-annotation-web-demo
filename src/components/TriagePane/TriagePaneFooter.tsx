import React from "react";
import { FileUploadButton } from "@/components/ui";

interface TriagePaneFooterProps {
    onFileSelect: (file: File) => void;
    reuploadInputRef: React.RefObject<HTMLInputElement | null>;
    successCount: number;
    failedCount: number;
    importDuration: number;
}

export default function TriagePaneFooter({
    onFileSelect,
    reuploadInputRef,
    successCount,
    failedCount,
    importDuration
}: TriagePaneFooterProps) {
    return (
        <div className={`h-15 bg-gray-100 border-t border-gray-200 
            flex items-center flex-shrink-0 px-4`
        }>
            {/* Left Column - Button */}
            <div className="flex-1 flex items-center">
                <FileUploadButton
                    onFileSelect={onFileSelect}
                    accept="application/json"
                    inputRef={reuploadInputRef}
                    size="sm"
                >
                    Reupload Events
                </FileUploadButton>
            </div>

            {/* Right Column - Stats */}
            <div className="flex-1 flex items-center justify-end">
                <div className="text-right">
                    <div className="text-xs text-gray-600">
                        <span className="font-medium">{successCount}</span> imported,
                        <span className="font-medium ml-1">{failedCount}</span> failed
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {importDuration > 0 && `${importDuration.toFixed(1)}ms`}
                    </div>
                </div>
            </div>
        </div>
    );
}
