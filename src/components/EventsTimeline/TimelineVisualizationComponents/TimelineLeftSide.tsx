import React from "react";

// Import global components and utilities
import { getTypeHexColor } from "@/utils/eventUtils";

interface TimelineLeftSideProps {
    types: string[];
}

export default function TimelineLeftSide({ types }: TimelineLeftSideProps) {
    return (
        <div className="w-32 flex-shrink-0 border-r border-gray-200">
            {/* Header row for "Event Type" */}
            <div className={
                `h-8 flex items-center px-3 pt-2 text-sm font-semibold 
                text-gray-600 bg-gray-100`
            }>
                Event Type
            </div>

            {/* Header row for spacing */}
            <div className={
                `h-10 flex items-center px-3 text-xs font-semibold 
                text-gray-600 bg-gray-100 border-b border-gray-200`
            }>
                {/* Empty cell for layout purpose */}
            </div>

            {types.map((type, index) => (
                <div
                    key={type}
                    className={
                        `h-12 flex items-center px-3 text-sm 
                        font-medium border-b border-gray-100 
                        ${index % 2 === 0 ?
                            'bg-gray-50'
                            :
                            'bg-white'
                        }`
                    }
                    style={{ color: getTypeHexColor(type) }}
                >
                    <span className="truncate" title={type}>
                        {type}
                    </span>
                </div>
            ))}
        </div>
    );
}
