import React from "react";

interface TimelineFooterProps {
    selectedEventsCount: number;
    minDate: Date | undefined;
    maxDate: Date | undefined;
    totalEvents: number;
    totalTypes: number;
}

export default function TimelineFooter({
    minDate, selectedEventsCount, maxDate,
    // totalEvents, totalTypes // not used atm
}: TimelineFooterProps) {
    // 
    if (!minDate || !maxDate) {
        return null;
    }

    return (
        <div className="p-3 bg-gray-100 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
            {/* Left column - Selected events and totals */}
            <div className="text-left">
                <span>
                    {selectedEventsCount} event{selectedEventsCount !== 1 ? 's' : ''} shown on the timeline
                </span>
            </div>

            {/* Right column - Timeline date range */}
            <div className="text-right">
                <span>
                    Timeline: {minDate.toLocaleDateString()} - {maxDate.toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}