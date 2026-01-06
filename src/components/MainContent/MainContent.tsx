import React, { useState, Suspense } from "react";

// Import global components and utilities
import { DndContext, DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import { useEventContext } from "@/store/EventContext";
import { EventCard } from "@/components/ui";
import { createDragStartHandler, createDragEndHandler } from "@/utils/dragUtils";
import { EventWithId } from "@/types/event";

import Header from "@/components/Header/Header";

// Lazy load heavy components
const TriagePane = React.lazy(() => import("@/components/TriagePane/TriagePane"));
const AnnotationPanel = React.lazy(() => import("@/components/Annotation/AnnotationPanel"));
const ReportPanel = React.lazy(() => import("@/components/Report/ReportPanel"));
const EventsTimelinePanel = React.lazy(() => import("@/components/EventsTimeline/EventsTimelinePanel"));

// Component loading fallback
const ComponentLoader = ({ name }: { name: string }) => (
    <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading {name}...</span>
    </div>
);

export default function MainContent() {
    // Global available states
    const { state, dispatch } = useEventContext();

    // Component-only states
    const [activeEvent, setActiveEvent] = useState<EventWithId | null>(null);

    // Component-only event handlers
    const handleDragStart = createDragStartHandler(setActiveEvent);
    const handleDragEnd = createDragEndHandler(state, dispatch, setActiveEvent);

    // @TODO: to be wrapped as an animation constant
    const dropAnimation = {
        duration: 0,
        easing: 'ease',
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0',
                },
            },
        }),
    };

    return (
        // Wrapping everything with dnd's context provider
        // For event card drag-n-drop
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Main layout */}
            <div className="font-[family-name:var(--font-geist-sans)] h-screen flex flex-col">
                <Header />
                <main className="flex flex-1 min-h-0">
                    <Suspense fallback={<ComponentLoader name="Triage Panel" />}>
                        <TriagePane />
                    </Suspense>
                    <section className="flex-1 flex flex-col min-h-0">
                        <Suspense fallback={<ComponentLoader name="Timeline" />}>
                            <EventsTimelinePanel label="Events Timeline" />
                        </Suspense>
                        <Suspense fallback={<ComponentLoader name="Annotation Panel" />}>
                            <AnnotationPanel />
                        </Suspense>
                        <Suspense fallback={<ComponentLoader name="Report Panel" />}>
                            <ReportPanel />
                        </Suspense>
                    </section>
                </main>
            </div>

            {/* Drag-and-drop overlay */}
            <DragOverlay dropAnimation={dropAnimation}>
                { // Check if the event card is being dragged
                    activeEvent ? (
                        <EventCard
                            event={activeEvent}
                            className="shadow-2xl border-2 border-blue-400 opacity-90 cursor-grabbing"
                            showSelectedOverlay={false}
                        />
                    ) : null
                }
            </DragOverlay>
        </DndContext>
    );
}
