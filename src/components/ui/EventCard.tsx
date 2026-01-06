import React from "react";

// Import global components and utilities
import { Event } from "@/types/event";
import { getTypeColor } from "@/utils/eventUtils";

interface EventCardProps {
    event: Event;
    className?: string;
    isSelected?: boolean;
    showSelectedOverlay?: boolean;
}

export default function EventCard({
    event,
    className = "",
    isSelected = false,
    showSelectedOverlay = true,
}: EventCardProps) {
    const baseClasses =
        `bg-white rounded shadow p-3 border border-gray-200 
        transition-all cursor-pointer relative`;
    const combinedClasses = `${baseClasses} ${className}`;

    return (
        <div className={combinedClasses}>
            {/* Overlay mask for selected state */}
            {isSelected && showSelectedOverlay && (
                <div className="absolute inset-0 bg-gray-100 opacity-80 rounded pointer-events-none"></div>
            )}

            {/* Main card content */}
            <div className="flex items-center justify-between mb-1">
                {/* Date and time */}
                <span className="text-xs text-gray-500 font-mono">
                    {new Date(event.time).toLocaleString()}
                </span>
                {/* Type of the event */}
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(event.type)}`}>
                        {event.type}
                    </span>
                </div>
            </div>
            {/* Short description */}
            <div className="font-semibold text-gray-800 truncate">{event.short}</div>
            {/* Full description */}
            <div className="text-xs text-gray-500 mt-1 truncate">{event.description}</div>
            {/* User (who created this event) */}
            {event.user && (
                <div className="text-xs text-gray-400 mt-1">By: {event.user}</div>
            )}
        </div>
    );
}
