import React from "react";

// Import global components and utilities
import { getTypeHexColor } from "@/utils/eventUtils";

interface AnimatedSelectionCircleProps {
    type: string;
    dotOffset: number;
}

export default function AnimatedSelectionCircle({ type, dotOffset }: AnimatedSelectionCircleProps) {
    return (
        <div
            className="absolute rounded-full border-2 animate-pulse -z-0"
            style={{
                width: `${dotOffset * 4}px`,
                height: `${dotOffset * 4}px`,
                left: `${-dotOffset * 1}px`,
                top: `${-dotOffset * 1}px`,
                borderColor: getTypeHexColor(type),
                animation: 'selectedDotPulse 2s ease-in-out infinite'
            }}
        />
    );
}
