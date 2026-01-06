import React, { useState, useEffect } from "react";

// Import global components and utilities
import { useDraggable } from "@dnd-kit/core";

import { EventWithId } from "@/types/event";
import { getUniqueTypes } from "@/utils/eventUtils";
import { useEventContext } from "@/store/EventContext";
import { EventCard, Pagination } from "@/components/ui";

interface TriageEventListProps {
    eventList: EventWithId[];
    filteredEvents: EventWithId[];
    pageSize?: number;
}

interface DraggableEventCardProps {
    event: EventWithId;
}

function DraggableEventCard({ event }: DraggableEventCardProps) {
    const { state } = useEventContext();
    const isSelected = state.selectedEvents.includes(event._id);

    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging,
    } = useDraggable({
        id: event._id,
        data: {
            event: event,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            tabIndex={isDragging ? -1 : 0}
            onFocus={(e) => {
                // prevent keyboard conflict with the auto-focus right after the card is being dropped.
                if (isDragging) {
                    e.preventDefault();
                    e.currentTarget.blur();
                }
            }}
        >
            <EventCard
                event={event}
                isSelected={isSelected}
                className={isDragging ? 'opacity-50' : 'hover:shadow-md'}
            />
        </div>
    );
}

export default function TriageEventList({
    eventList,
    filteredEvents,
    pageSize = 20
}: TriageEventListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination values
    const totalPages = Math.ceil(filteredEvents.length / pageSize);

    // Reset to first page when filtered events change
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    if (eventList.length === 0) return null;

    const totalEvents = eventList.length;
    const totalTypes = getUniqueTypes(eventList).length;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {/* Header with totals - fixed at top */}
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-600">
                    Loaded {totalEvents} events across {totalTypes} types in total.
                </span>
            </div>

            {/* Pagination controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredEvents.length}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
            />

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                    {paginatedEvents.map((event) => (
                        <DraggableEventCard key={event._id} event={event} />
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="text-gray-400 text-center mt-8">
                            No events found.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
