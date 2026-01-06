/**
 * Utility functions for event management
 */

import { Event, EventWithId } from "../types/event";
import { uploadJSONFile } from "./fileUtils";

// Use a more lightweight ID generator for better performance
const generateId = () => {
    // Generated with Claude Sonnet
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Validate an event object
export function validateEvent(obj: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (typeof obj !== "object" || obj === null) errors.push("Not an object");

    const eventObj = obj as Record<string, unknown>;
    if (typeof eventObj.type !== "string") errors.push("type");
    if (typeof eventObj.short !== "string") errors.push("short");
    // user is optional, but if present, must be a string
    if (typeof eventObj.user !== "undefined" && typeof eventObj.user !== "string") errors.push("user");
    if (typeof eventObj.description !== "string") errors.push("description");
    if (typeof eventObj.time !== "string" || isNaN(Date.parse(eventObj.time))) errors.push("time");
    return { valid: errors.length === 0, errors };
}

// Get unique event types from an array of events
export function getUniqueTypes(events: { type: string }[]): string[] {
    return Array.from(new Set(events.map(e => e.type)));
    // return Array.from(new Set(events.map(e => "LogAnomoly")));
}

export const typeColorMap: Record<string, string> = {
    Deployment: "bg-blue-100 text-blue-700",
    Incident: "bg-red-100 text-red-700",
    Alert: "bg-yellow-100 text-yellow-700",
    Info: "bg-green-100 text-green-700",
    LogAnomoly: "bg-orange-100 text-orange-700",
    MetricAnomoly: "bg-red-100 text-red-700",
    Maintenance: "bg-purple-100 text-purple-700",
    Release: "bg-green-100 text-green-700",
    // Add more types as needed
};

// Hex color map for timeline visualization
export const typeHexColorMap: Record<string, string> = {
    Deployment: '#3B82F6',
    Incident: '#DC2626',
    Alert: '#F59E0B',
    Info: '#10B981',
    LogAnomoly: '#F97316',
    MetricAnomoly: '#EF4444',
    Maintenance: '#8B5CF6',
    Release: '#10B981',
    // Add more types as needed
};

export function getTypeColor(type: string) {
    return typeColorMap[type] || "bg-gray-200 text-gray-700";
}

export function getTypeHexColor(type: string): string {
    return typeHexColorMap[type] || '#6B7280';
}

// Convert a generic event to an EventWithId type
export function toEventWithId(event: Event): EventWithId {
    return { ...event, _id: generateId() };
}

// Sort events by time (most recent first)
export function sortEventsByTime<T extends { time: string }>(events: T[]): T[] {
    return [...events].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

// Type for parsed JSON result
export interface ParsedEventsResult {
    valid: Array<Event & { _id: string }>;
    failed: number;
    failedDetails: string[][];
    success: number;
    duration?: number; // Optional duration in milliseconds
}

// Parse JSON data and validate events
export function parseEventsFromJSON(
    jsonData: string,
    onProgress?: (
        progress: number,
        step: string,
        totalItems?: number,
        processedItems?: number
    ) => void
): ParsedEventsResult {
    onProgress?.(10, "Parsing JSON data...");

    const json = JSON.parse(jsonData);
    if (!Array.isArray(json)) {
        throw new Error("JSON is not an array");
    }

    onProgress?.(20, "Validating events...", json.length, 0);

    const valid: Array<Event & { _id: string }> = [];
    let failed = 0;
    const failedFields: string[][] = [];

    for (let i = 0; i < json.length; i++) {
        const item = json[i];
        const result = validateEvent(item);

        if (result.valid) {
            valid.push(toEventWithId(item));
        } else {
            failed++;
            failedFields.push(result.errors);
        }

        // Update progress every 100 items or on the last item
        if (i % 100 === 0 || i === json.length - 1) {
            const progress = 20 + (i / json.length) * 60; // 20% to 80%
            onProgress?.(progress, "Validating events...", json.length, i + 1);
        }
    }

    onProgress?.(90, "Sorting events...", json.length, valid.length);

    // Sort events by time (most recent first) before returning
    const sortedEvents = sortEventsByTime(valid);

    onProgress?.(100, "Import complete!", json.length, valid.length);

    return {
        valid: sortedEvents,
        failed,
        failedDetails: failedFields,
        success: valid.length
    };
}

// File upload handler utility for events
export function handleFileUpload(
    file: File,
    onSuccess: (
        result: ParsedEventsResult
    ) => void,
    onError: (
        error: string
    ) => void,
    onProgress?: (
        progress: number,
        step: string,
        totalItems?: number,
        processedItems?: number
    ) => void
): void {
    uploadJSONFile(
        file,
        parseEventsFromJSON,
        onSuccess,
        onError,
        onProgress
    );
}
