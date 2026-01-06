/**
 * Utility functions for drag and drop operations
 */

import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { EventWithId } from "@/types/event";
import { EventState, EventAction } from "@/store/EventContext";
import { Dispatch } from "react";

export const createDragStartHandler = (
    setActiveEvent: (event: EventWithId | null) => void
) => {
    // Return a function that handles the drag start event
    return (event: DragStartEvent) => {
        setActiveEvent(event.active.data.current?.event);
    };
};

export const createDragEndHandler = (
    state: EventState,
    dispatch: Dispatch<EventAction>,
    setActiveEvent: (event: EventWithId | null) => void
) => {
    // Return a function that handles the drag end event
    return (event: DragEndEvent) => {
        // Destructure the event object
        // - active is the item being dragged
        // - over is the item being hovered over (if any)
        const { active, over } = event;

        if (over && over.id === 'timeline-drop-zone') {
            // Get the event data from the dragged item
            const eventData = active.data.current?.event;
            if (eventData) {
                // Check if the event is already selected to avoid duplicates
                if (!state.selectedEvents.includes(eventData._id)) {
                    // Add the event to selected events (using the event's _id as the identifier)
                    dispatch({ type: "ADD_SELECTED_EVENT", payload: eventData._id });
                    // Add the event to the report
                    dispatch({ type: "ADD_REPORT_ITEM", payload: eventData });
                }

                // Automatically select the dropped event in the annotation panel
                dispatch({ type: "SET_SELECTED_EVENT", payload: eventData });
            }
        }

        setActiveEvent(null);
    };
};
