// Import global components and utilities
import { useEventContext } from "@/store/EventContext";

// Import local components
import EventDetail from "./EventDetail";
import EventNote from "./EventNote";

export default function AnnotationContent() {
    const { state } = useEventContext();
    const selectedEvent = state.selectedEvent;

    return (
        <div className="flex-1 min-h-0 flex">
            {selectedEvent ?
                (   /* Render event details */
                    <>
                        <EventDetail selectedEvent={selectedEvent} />
                        <EventNote selectedEvent={selectedEvent} />
                    </>
                ) : (
                    /* Blank canvas when no event selected */
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <p className="text-lg font-semibold">No events in timeline</p>
                            <p className="text-sm mt-2">Drag events from the left panel to see their details</p>
                        </div>
                    </div>
                )}
        </div>
    );
}
