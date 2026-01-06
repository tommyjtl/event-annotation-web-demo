'use client'

import React, { useRef, useState } from "react";

// Import global components and utilities
import { useEventContext } from "@/store/EventContext";
import {
    getUniqueTypes,
    ParsedEventsResult
} from "@/utils/eventUtils";
import { EventWithId } from "@/types/event";
import { SectionHeader, ImportProgressModal } from "@/components/ui";
import { useTriageFilter } from "@/hooks/useTriageFilter";
import { createUploadHandler } from "@/utils/uploadUtils";

// Import local components
import TriageSearch from "./TriageSearch";
import TriageEmptyView from "./TriageEmptyView";
import TriageMainContentView from "./TriageMainContentView";

interface TriagePaneProps {
    pageSize?: number;
}

export default function TriagePane({
    pageSize = 20
}: TriagePaneProps = {}) {
    const { state, dispatch } = useEventContext();

    const [failedCount, setFailedCount] = useState(0);
    const [, setFailedDetails] = useState<string[][]>([]);
    const [successCount, setSuccessCount] = useState(0);
    const [, setShowCards] = useState(false);
    const [importDuration, setImportDuration] = useState<number>(0);
    const [eventList, setEventList] = useState<EventWithId[]>([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [caseSensitive, setCaseSensitive] = useState(false);

    // Import progress modal state
    const [showImportModal, setShowImportModal] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importStep, setImportStep] = useState("");
    const [importFileName, setImportFileName] = useState("");
    const [importTotalItems, setImportTotalItems] = useState<number | undefined>();
    const [importProcessedItems, setImportProcessedItems] = useState<number | undefined>();

    const inputRef = useRef<HTMLInputElement>(null);
    const reuploadInputRef = useRef<HTMLInputElement>(null);

    // Use the debounced search and filter hook
    const filteredEvents = useTriageFilter({
        eventList,
        search,
        typeFilter,
        caseSensitive
    });

    // Create upload handler using the utility
    const handleUpload = createUploadHandler(
        {
            onSuccess: (result: ParsedEventsResult) => {
                setEventList(result.valid);
                dispatch({ type: "SET_EVENTS", payload: result.valid });

                // Reset all timeline, annotation, and report states
                dispatch({ type: "SET_SELECTED_EVENTS", payload: [] });
                dispatch({ type: "SET_SELECTED_EVENT", payload: null });

                // Clear all report items
                state.report.forEach(item => {
                    dispatch({ type: "REMOVE_REPORT_ITEM", payload: item._id });
                });

                // Clear all notes
                state.notes.forEach(note => {
                    dispatch({ type: "REMOVE_NOTE", payload: note._id });
                });

                setFailedCount(result.failed);
                setFailedDetails(result.failedDetails);
                setSuccessCount(result.success);
                setImportDuration(result.duration || 0);
                setShowCards(result.valid.length > 0);

                // Hide import modal after a brief delay
                // Currently set to 2500ms
                setTimeout(() => {
                    setShowImportModal(false);
                }, 2500);
            },
            onError: (
                // error: string
            ) => {
                setFailedCount(0);
                setFailedDetails([]);
                setSuccessCount(0);
                setImportDuration(0);
                setShowImportModal(false);
                // alert(error); // @TODO show a notification pop-up in the future
            },
            onProgress: (progress: number, step: string, totalItems?: number, processedItems?: number) => {
                setImportProgress(progress);
                setImportStep(step);
                setImportTotalItems(totalItems);
                setImportProcessedItems(processedItems);

                // Show modal on first progress update
                if (!showImportModal) {
                    setShowImportModal(true);
                }
            }
        },
        {
            inputRef,
            reuploadInputRef,
            measurePerformance: true
        }
    );

    // Wrap the upload handler to capture file name
    const handleFileUploadInTriagePane = (
        file: File
    ) => {
        setImportFileName(file.name);
        setImportProgress(0);
        setImportStep("Starting import...");
        setImportTotalItems(undefined);
        setImportProcessedItems(undefined);
        handleUpload(file);
    };

    // Handler for loading example data
    const handleLoadExample = async () => {
        try {
            const response = await fetch('/events.json');
            const blob = await response.blob();
            const file = new File([blob], 'events.json', { type: 'application/json' });
            handleFileUploadInTriagePane(file);
        } catch (error) {
            console.error('Failed to load example data:', error);
        }
    };

    return (
        <section className={
            `w-[380px] min-w-[260px] max-w-[400px] 
            border-r border-gray-200 flex flex-col 
            bg-gray-50`
        }>
            {/* Triage Pane: Header */}
            <SectionHeader label="Raw Events" className="flex-shrink-0" />

            {/* Triage Pane: Search and Filter */}
            <TriageSearch
                search={search}
                setSearch={setSearch}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                eventListLength={eventList.length}
                eventTypes={getUniqueTypes(eventList)}
                caseSensitive={caseSensitive}
                setCaseSensitive={setCaseSensitive}
            />

            {/* Triage Pane: Main Content */}
            {state.events.length === 0 ? (
                <TriageEmptyView
                    onFileSelect={handleFileUploadInTriagePane}
                    inputRef={inputRef}
                    onLoadExample={handleLoadExample}
                />
            ) : (
                <TriageMainContentView
                    eventList={eventList}
                    filteredEvents={filteredEvents}
                    onFileSelect={handleFileUploadInTriagePane}
                    reuploadInputRef={reuploadInputRef}
                    successCount={successCount}
                    failedCount={failedCount}
                    importDuration={importDuration}
                    pageSize={pageSize}
                />
            )}

            {/* Import Progress Modal */}
            <ImportProgressModal
                isOpen={showImportModal}
                progress={importProgress}
                fileName={importFileName}
                currentStep={importStep}
                totalItems={importTotalItems}
                processedItems={importProcessedItems}
            />
        </section>
    );
}
