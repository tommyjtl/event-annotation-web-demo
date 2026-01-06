import React from "react";

// Import global components and utilities
import { getUniqueTypes } from "@/utils/eventUtils";
import type { Event } from "@/types/event";

// Import local components
import { TimelineLeftSide, TimelineRightSide } from "./TimelineVisualizationComponents";

interface TimelineContentProps {
    events: Event[];
    selectedEvents: string[];
    timelineData: Record<string, Array<{ event: Event & { _id: string }, isVisible: boolean }>>;
    minDate: Date | undefined;
    maxDate: Date | undefined;
    timeRangeMs: number;
    currentDotConfig: { className: string; offset: number };
    isOver: boolean;
}

export default function TimelineVisualization({
    events,
    selectedEvents,
    timelineData,
    minDate,
    maxDate,
    timeRangeMs,
    currentDotConfig,
    // isOver, not used at the moment
}: TimelineContentProps) {
    const types = getUniqueTypes(events);

    // Reset selection handler
    if (selectedEvents.length === 0) {
        return (
            <div className="min-h-[200px] flex items-center justify-center text-gray-400">
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <p className="text-lg font-semibold">No events in timeline</p>
                        <p className="text-sm mt-2">Upload events and drag any of them to <b>here</b></p>
                    </div>
                </div>
            </div>
        );
    }

    console.log(timelineData)

    return (
        <div className="flex">
            <TimelineLeftSide
                types={types}
            />
            <TimelineRightSide
                types={types}
                timelineData={timelineData}
                minDate={minDate}
                maxDate={maxDate}
                timeRangeMs={timeRangeMs}
                currentDotConfig={currentDotConfig}
            />
        </div>
    );
}
