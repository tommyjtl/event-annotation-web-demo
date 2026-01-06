import React from "react";

// Import global components and utilities
import { getTypeHexColor } from "@/utils/eventUtils";
import type { Event } from "@/types/event";

interface EventTooltipProps {
    event: Event & { _id: string };
    x: number;
    y: number;
}

export default function EventTooltip({ event, x, y }: EventTooltipProps) {
    return (
        <div
            className={`fixed z-50 px-3 py-2 text-xs text-white rounded-lg shadow-lg 
                pointer-events-none transform -translate-x-1/2 -translate-y-full`
            }
            style={{
                left: x,
                top: y,
                backgroundColor: getTypeHexColor(event.type)
            }}
        >
            <div className="font-semibold pb-1">
                {new Date(event.time).toLocaleString()}
            </div>
            <div className="text-xs opacity-90">
                {event.short}
            </div>
            {/* Arrow */}
            <div
                className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0"
                style={{
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: `4px solid ${getTypeHexColor(event.type)}`
                }}
            />
        </div>
    );
}
