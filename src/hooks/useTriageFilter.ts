import { useEffect, useRef, useState } from "react";

// Import global components and utilities
import { EventWithId } from "@/types/event";
import { sortEventsByTime } from "@/utils/eventUtils";

interface UseTriageFilterProps {
    eventList: EventWithId[];
    search: string;
    typeFilter: string;
    caseSensitive: boolean;
    debounceMs?: number;
}

export const useTriageFilter = ({
    eventList,
    search,
    typeFilter,
    caseSensitive,
    debounceMs = 200
}: UseTriageFilterProps) => {
    const [filteredEvents, setFilteredEvents] = useState<EventWithId[]>([]);
    const searchAbort = useRef<AbortController | null>(null);

    useEffect(() => {
        if (searchAbort.current) searchAbort.current.abort();
        const controller = new AbortController();
        searchAbort.current = controller;

        const handler = setTimeout(() => {
            if (controller.signal.aborted) return;

            let filtered = eventList;

            // Apply type filter
            if (typeFilter) {
                filtered = filtered.filter(e => e.type === typeFilter);
            }

            // Apply search filter
            if (search.trim()) {
                const kw = search.trim();
                filtered = filtered.filter(e =>
                    Object.values(e).some(val => {
                        if (typeof val !== "string") return false;
                        if (caseSensitive) {
                            return val.includes(kw);
                        } else {
                            return val.toLowerCase().includes(kw.toLowerCase());
                        }
                    })
                );
            }

            // Sort filtered events by time (most recent first)
            setFilteredEvents(sortEventsByTime(filtered));
        }, debounceMs);

        return () => {
            clearTimeout(handler);
            controller.abort();
        };
    }, [search, typeFilter, eventList, caseSensitive, debounceMs]);

    return filteredEvents;
};
