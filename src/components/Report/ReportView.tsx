import React, { useState, useEffect, useRef } from "react";

// Import global components and utilities
import { generateRawTextReport } from "@/utils/reportUtils";
import { CopyButton } from "@/components/ui";
import { ReportItem } from "@/store/EventContext";

interface ReportViewProps {
    reportItems: ReportItem[];
}

export default function ReportView({ reportItems }: ReportViewProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // State for customization options
    const [includeEventType, setIncludeEventType] = useState(false);
    const [includeEventShort, setIncludeEventShort] = useState(false);
    const [includeNote, setIncludeNote] = useState(true); // default checked

    const rawTextReport = generateRawTextReport(reportItems, {
        includeEventType,
        includeEventShort,
        includeNote
    });

    // Scroll to bottom whenever report content changes
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [rawTextReport]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-3">
                {/* Customization Options */}
                <div className="mb-0">
                    <div className="flex items-center justify-between">
                        {/* Left side - Checkboxes */}
                        <div className="flex items-center gap-6">
                            <label className="flex items-center text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={includeEventType}
                                    onChange={(e) => setIncludeEventType(e.target.checked)}
                                    className="mr-2"
                                />
                                Include event type
                            </label>
                            <label className="flex items-center text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={includeEventShort}
                                    onChange={(e) => setIncludeEventShort(e.target.checked)}
                                    className="mr-2"
                                />
                                Include event short description
                            </label>
                            <label className="flex items-center text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={includeNote}
                                    onChange={(e) => setIncludeNote(e.target.checked)}
                                    className="mr-2"
                                />
                                Include note
                            </label>
                        </div>

                        {/* Right side - Copy Button */}
                        <CopyButton
                            text={rawTextReport}
                            defaultText="Copy Report"
                            size="sm"
                            className="text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Report Text */}
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md p-4">
                <textarea
                    ref={textareaRef}
                    value={rawTextReport}
                    disabled
                    className={
                        `w-full h-full text-xs text-gray-900 font-mono 
                        resize-none border-none bg-transparent 
                        focus:outline-none leading-relaxed overflow-y-auto`
                    }
                    placeholder="Report will appear here..."
                />
            </div>
        </div>
    );
}
