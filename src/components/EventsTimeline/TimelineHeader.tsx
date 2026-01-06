import React from "react";

// Import global components and utilities
import { useEventContext } from "@/store/EventContext";
import { SectionHeader } from "@/components/ui";

interface TimelineHeaderProps {
    label: string;
    selectedEventsCount: number;
    dotSize: 'small' | 'medium' | 'large';
    onDotSizeChange: (size: 'small' | 'medium' | 'large') => void;
    onResetSelection: () => void;
}

export default function TimelineHeader(
    { label, selectedEventsCount, dotSize, onDotSizeChange, onResetSelection }: TimelineHeaderProps
) {
    // Global available states
    const { dispatch } = useEventContext();

    // Component-only event handlers
    const handleResetSelection = () => {
        // Reset the selected events
        onResetSelection();
        // Also reset the selected event in the annotation panel
        dispatch({ type: "SET_SELECTED_EVENT", payload: null });
    };

    return (
        <SectionHeader label={label}>
            {/* Reset Button */}
            {selectedEventsCount > 0 && (
                <button
                    onClick={handleResetSelection}
                    className={
                        `px-3 py-1 text-xs font-medium 
                        text-red-600 border border-red-300 
                        rounded hover:bg-red-50 transition-colors 
                        flex items-center`
                    }
                >
                    Reset Selection
                </button>
            )}

            {/* Dot Size Control */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Dot Size:</span>
                <div className="flex border border-gray-300 rounded bg-white">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                            key={size}
                            onClick={() => onDotSizeChange(size)}
                            className={
                                `px-2 py-1 text-xs font-medium 
                                capitalize transition-colors flex items-center 
                                ${dotSize === size ?
                                    'bg-blue-500 text-white'
                                    :
                                    'text-gray-600 hover:bg-gray-100'
                                } 
                                ${size === 'small' ?
                                    'rounded-l'
                                    :
                                    size === 'large' ?
                                        'rounded-r' :
                                        ''
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </SectionHeader>
    );
}
