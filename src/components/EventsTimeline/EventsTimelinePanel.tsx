'use client'

import React, { useMemo } from "react";

// Import global components and utilities
import { useDroppable } from "@dnd-kit/core";
import { useEventContext } from "@/store/EventContext";
import { getUniqueTypes } from "@/utils/eventUtils";
import type { Event, EventWithId } from "@/types/event";
import { useDotSizeControl } from "@/hooks/useDotSizeControl";

// Import local components
import TimelineHeader from "./TimelineHeader";
import TimelineVisualization from "./TimelineVisualization";
import TimelineFooter from "./TimelineFooter";

interface TimelineVisualizationProps {
    label: string;
}

export default function EventsTimelinePanel({ label }: TimelineVisualizationProps) {
    // Global available states
    const { state, dispatch } = useEventContext();
    const events = state.events;
    const selectedEvents = state.selectedEvents;

    // Component-only hooks
    // Use dot size control hook
    const { dotSize, setDotSize, currentDotConfig } = useDotSizeControl('medium');
    // Set up droppable for the timeline
    const { isOver, setNodeRef } = useDroppable({
        id: 'timeline-drop-zone',
    });

    // Component-only event handlers
    const types = getUniqueTypes(events);

    // Function to reset selected events
    const handleResetSelection = () => {
        // Clear all selected events
        dispatch({ type: "SET_SELECTED_EVENTS", payload: [] });
        // Clear all report items
        state.report.forEach(item => {
            dispatch({ type: "REMOVE_REPORT_ITEM", payload: item._id });
        });
    };

    // Create data structure for timeline display
    // Group events by type and track which ones are selected for display
    const timelineData = useMemo(() => {
        const data: Record<
            string, Array<{
                event: Event & { _id: string },
                isVisible: boolean
            }>> = {};

        // Initialize with all event types
        types.forEach(type => {
            data[type] = [];
            // data["loganomoly"] = [];
        });

        // Add all events to their respective type groups
        events.forEach(event => {
            const eventWithId = event as EventWithId;
            if (data[event.type]) {
                data[event.type].push({
                    // data["loganomoly"].push({
                    event: eventWithId,
                    isVisible: selectedEvents.includes(eventWithId._id)
                });
            }
        });
        // console.log(events)

        return data;
    }, [events, selectedEvents, types]);

    // Calculate min/max dates and time range for selected events only
    const { minDate, maxDate, timeRangeMs } = useMemo(() => {
        const selectedEventObjs = events.filter(
            e => selectedEvents.includes((e as Event & { _id: string })._id)
        );

        if (selectedEventObjs.length === 0) {
            return { minDate: undefined, maxDate: undefined, timeRangeMs: 0 };
        }

        const times = selectedEventObjs.map(e => new Date(e.time).getTime());
        const min = Math.min(...times);
        const max = Math.max(...times);
        return {
            minDate: new Date(min),
            maxDate: new Date(max),
            timeRangeMs: max - min || 1 // Avoid division by zero
        };
    }, [events, selectedEvents]);

    return (
        <div
            ref={setNodeRef}
            className={`
                border-b border-gray-200 rounded bg-white transition-colors 
                ${isOver ?
                    'border-blue-500 bg-blue-50'
                    :
                    ''
                }`}
        >
            <TimelineHeader
                label={label}
                selectedEventsCount={selectedEvents.length}
                dotSize={dotSize}
                onDotSizeChange={setDotSize}
                onResetSelection={handleResetSelection}
            />

            {/* Timeline Content */}
            <div className={`
                transition-colors 
                ${isOver ?
                    'bg-blue-100'
                    :
                    'bg-white'
                }`}>
                <TimelineVisualization
                    events={events}
                    selectedEvents={selectedEvents}
                    timelineData={timelineData}
                    minDate={minDate}
                    maxDate={maxDate}
                    timeRangeMs={timeRangeMs}
                    currentDotConfig={currentDotConfig}
                    isOver={isOver}
                />

                {isOver && (
                    <div className="p-4 text-blue-600 font-medium text-center border-b border-blue-200">
                        Drop event here to add to timeline
                    </div>
                )}
            </div>

            <TimelineFooter
                selectedEventsCount={selectedEvents.length}
                minDate={minDate}
                maxDate={maxDate}
                totalEvents={events.length}
                totalTypes={types.length}
            />
        </div>
    );
}