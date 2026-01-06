import React from "react";

// Import global components and utilities
import { EventWithId } from "@/types/event";

// Import local components
import TriageEventList from "./TriageEventList";
import TriagePaneFooter from "./TriagePaneFooter";

interface TriageMainContentViewProps {
    eventList: EventWithId[];
    filteredEvents: EventWithId[];
    onFileSelect: (file: File) => void;
    reuploadInputRef: React.RefObject<HTMLInputElement | null>;
    successCount: number;
    failedCount: number;
    importDuration: number;
    pageSize?: number;
}

export default function TriageMainContentView({
    eventList,
    filteredEvents,
    onFileSelect,
    reuploadInputRef,
    successCount,
    failedCount,
    importDuration,
    pageSize
}: TriageMainContentViewProps) {
    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Event List Area - takes remaining space */}
            <div className="flex-1 min-h-0 flex flex-col">
                <TriageEventList
                    eventList={eventList}
                    filteredEvents={filteredEvents}
                    pageSize={pageSize}
                />
            </div>

            {/* Bottom Fixed Area */}
            <TriagePaneFooter
                onFileSelect={onFileSelect}
                reuploadInputRef={reuploadInputRef}
                successCount={successCount}
                failedCount={failedCount}
                importDuration={importDuration}
            />
        </div>
    );
}
