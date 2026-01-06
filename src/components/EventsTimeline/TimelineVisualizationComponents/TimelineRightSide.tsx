import React, { useState, useMemo, memo } from "react";

// Import global components and utilities
import { useEventContext } from "@/store/EventContext";
import { getTypeHexColor } from "@/utils/eventUtils";
import type { Event, EventWithId } from "@/types/event";
import { useKeyboardShortcutBuilder } from "@/hooks/useKeyboardShortcut";

// Import local components
import EventTooltip from "./EventTooltip";
import AnimatedSelectionCircle from "./AnimatedSelectionCircle";

interface TimelineRightSideProps {
    types: string[];
    timelineData: Record<
        string, Array<{
            event: Event & { _id: string },
            isVisible: boolean
        }>>;
    minDate: Date | undefined;
    maxDate: Date | undefined;
    timeRangeMs: number;
    currentDotConfig: { className: string; offset: number };
}

function TimelineRightSide({
    types,
    timelineData,
    minDate,
    maxDate,
    timeRangeMs,
    currentDotConfig
}: TimelineRightSideProps) {
    // Global available states
    const { state, dispatch } = useEventContext();
    const selectedEvent = state.selectedEvent;

    // Component-only states
    const [hoveredEvent, setHoveredEvent] = useState<{
        event: Event & { _id: string },
        x: number, y: number
    } | null>(null);

    // Component-only event handlers
    const handleEventClick = (event: EventWithId) => {
        dispatch({ type: "SET_SELECTED_EVENT", payload: event });
    };

    // Handle mouse enter and leave events for tooltips
    const handleEventMouseEnter = (event: Event & { _id: string }, mouseEvent: React.MouseEvent) => {
        const rect = (mouseEvent.currentTarget as HTMLElement).getBoundingClientRect();
        setHoveredEvent({
            event,
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    // Handle mouse leave to hide tooltip
    const handleEventMouseLeave = () => {
        setHoveredEvent(null);
    };

    // Get all visible events sorted by time for navigation - memoized for performance
    const visibleEvents = useMemo(() => {
        const allEvents: (Event & { _id: string })[] = [];
        Object.values(timelineData).forEach(typeEvents => {
            typeEvents.forEach(item => {
                if (item.isVisible) {
                    allEvents.push(item.event);
                }
            });
        });
        return allEvents.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    }, [timelineData]);

    // Navigate to previous event
    const handlePreviousEvent = () => {
        if (visibleEvents.length === 0) return;

        if (!selectedEvent) {
            // If no event is selected, select the first one
            handleEventClick(visibleEvents[0]);
            return;
        }

        const currentIndex = visibleEvents.findIndex(event => event.time === selectedEvent.time);
        if (currentIndex > 0) {
            handleEventClick(visibleEvents[currentIndex - 1]);
        }
    };

    // Navigate to next event
    const handleNextEvent = () => {
        if (visibleEvents.length === 0) return;

        if (!selectedEvent) {
            // If no event is selected, select the first one
            handleEventClick(visibleEvents[0]);
            return;
        }

        const currentIndex = visibleEvents.findIndex(event => event.time === selectedEvent.time);
        if (currentIndex < visibleEvents.length - 1) {
            handleEventClick(visibleEvents[currentIndex + 1]);
        }
    };

    // Keyboard shortcuts for navigation
    useKeyboardShortcutBuilder()
        .addArrow('left', handlePreviousEvent, [selectedEvent, visibleEvents], visibleEvents.length > 0)
        .addArrow('right', handleNextEvent, [selectedEvent, visibleEvents], visibleEvents.length > 0);

    return (
        <div className="flex-1">
            <div className="relative">
                {/* Header row for "Date" */}
                <div className={
                    `h-8 flex items-center bg-gray-100 
                    border-b border-gray-200 relative`
                }>
                    {/* Header row for "Date" with tickers */}
                    {
                        minDate && maxDate &&
                        // If minDate and maxDate are defined, generate date tickers
                        (
                            <div className="absolute inset-0 flex items-center">
                                {/* Generate date tickers */}
                                {
                                    // Generate 5 evenly spaced date tickers, 
                                    // each representing 25% of the timeline
                                    Array.from({ length: 5 }, (_, i) => {
                                        const tickerPosition = (i / 4) * 100; // 0%, 25%, 50%, 75%, 100%
                                        const tickerTime = new Date(
                                            minDate.getTime() + (timeRangeMs * i / 4)
                                        );
                                        return (
                                            <div
                                                key={i}
                                                className="absolute flex items-center"
                                                style={{
                                                    // Center the ticker dynamically based on the position
                                                    left: `calc(2rem + ${tickerPosition}% * 0.8 - 20px)`
                                                }}
                                            >
                                                <div className={
                                                    `text-xs text-gray-600 whitespace-nowrap font-medium`
                                                }>
                                                    {tickerTime.toLocaleDateString([], {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        )}
                </div>

                {/* Header row for "Time" with tickers */}
                <div className="h-10 flex items-center bg-gray-100 border-b border-gray-200 relative">
                    {/* Time tickers */}
                    {minDate && maxDate && (
                        <div className="absolute inset-0 flex items-end">
                            {/* Generate time tickers */}
                            {
                                Array.from({ length: 5 }, (_, i) => {
                                    const tickerPosition = (i / 4) * 100; // 0%, 25%, 50%, 75%, 100%
                                    const tickerTime = new Date(
                                        minDate.getTime() + (timeRangeMs * i / 4)
                                    );

                                    return (
                                        <div
                                            key={i}
                                            className="absolute flex flex-col items-center"
                                            style={{
                                                // Center the ticker
                                                left: `calc(2rem + ${tickerPosition}% * 0.8 - 20px)`
                                            }}
                                        >
                                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                                {tickerTime.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="w-px h-1.5 bg-gray-400 mb-2 mt-0.5"></div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )}
                </div>

                {/* Event Tracks */}
                {
                    types.map((type, index) => {
                        // console.log(type)

                        const typeEvents = timelineData[type] || [];
                        const visibleEvents = typeEvents.filter(item => item.isVisible);

                        // Render the track for certain type
                        return (
                            <div
                                key={type}
                                className={
                                    `h-12 border-b border-gray-100 flex items-center relative 
                                ${index % 2 === 0 ?
                                        'bg-gray-50'
                                        :
                                        'bg-white'
                                    }`
                                }
                            >
                                {
                                    visibleEvents.length === 0 ? (
                                        <div className="px-4 text-xs text-gray-400">
                                            No events selected for {type}
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full flex items-center">
                                            {/* Timeline horizontal line */}
                                            <div
                                                className="absolute w-full h-0.5 bg-gray-200"
                                                style={{ left: '2rem', width: 'calc(100% - 4rem)' }}
                                            ></div>

                                            {/* Event dots */}
                                            {visibleEvents.map((item) => {
                                                // console.log(item)

                                                const eventTime = new Date(item.event.time).getTime();
                                                const minTime = minDate?.getTime() || 0;

                                                // Calculate position as percentage of timeline
                                                const position = timeRangeMs > 0
                                                    ? ((eventTime - minTime) / timeRangeMs) * 100
                                                    : 0;

                                                // Check if the event is selected
                                                const isSelected = selectedEvent && //
                                                    selectedEvent.time === item.event.time;

                                                return (
                                                    <div
                                                        key={item.event._id}
                                                        className="absolute"
                                                        style={{
                                                            left: `calc(2rem + ${position}% * 0.8 - ${currentDotConfig.offset}px)`
                                                            , // 2rem offset + position scaled to 80% - half dot width
                                                        }}
                                                    >
                                                        {/* Animated selection circle */}
                                                        {isSelected && (
                                                            <AnimatedSelectionCircle
                                                                type={type}
                                                                dotOffset={currentDotConfig.offset}
                                                            />
                                                        )}

                                                        {/* Event dot */}
                                                        <div
                                                            className={
                                                                `rounded-full bg-white cursor-pointer 
                                                        hover:scale-125 transition-all 
                                                        duration-300 ease-in-out relative z-10 
                                                        ${currentDotConfig.className}`
                                                            }
                                                            style={{
                                                                borderColor: getTypeHexColor(type),
                                                                backgroundColor: getTypeHexColor(type)
                                                            }}
                                                            title={
                                                                `${item.event.short} - 
                                                        ${new Date(item.event.time).toLocaleString()}`
                                                            }
                                                            onClick={() => handleEventClick(item.event)}
                                                            onMouseEnter={(e) => handleEventMouseEnter(item.event, e)}
                                                            onMouseLeave={handleEventMouseLeave}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                }
                            </div>
                        );
                    })
                }
            </div>

            {/* Overlayed Tooltips */}
            {hoveredEvent && (
                <EventTooltip
                    event={hoveredEvent.event}
                    x={hoveredEvent.x}
                    y={hoveredEvent.y}
                />
            )}
        </div>
    );
}

// Export memoized component for better performance
export default memo(TimelineRightSide);
