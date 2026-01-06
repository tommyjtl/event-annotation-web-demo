import React from "react";

// Import global components and utilities
import { getTypeColor } from "@/utils/eventUtils";
import type { Event } from "@/types/event";

interface EventDetailProps {
    selectedEvent: Event;
}

export default function EventDetail({ selectedEvent }: EventDetailProps) {
    // Unified styling variables
    const labelStyle = "text-xs font-regular text-gray-500 uppercase tracking-wide";
    const contentStyle = "text-sm text-gray-900 mt-1";

    return (
        <div className="w-1/2 p-4 border-r border-gray-200">
            <div className="h-full overflow-y-auto">
                <div className="mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(selectedEvent.type)}`}>
                        {selectedEvent.type}
                    </span>
                </div>

                {/* Event details content */}
                <div className="space-y-3">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className={labelStyle}>DateTime</label>
                            <p className={contentStyle}>
                                {selectedEvent.time ? new Date(selectedEvent.time).toLocaleString() : "N/A"}
                            </p>
                        </div>
                        <div className="flex-1">
                            <label className={labelStyle}>User</label>
                            <p className={contentStyle}>
                                {selectedEvent.user || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>Short</label>
                        <p className={contentStyle}>
                            {selectedEvent.short}
                        </p>
                    </div>
                    <div>
                        <label className={labelStyle}>Description</label>
                        <p className={contentStyle}>
                            {selectedEvent.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
