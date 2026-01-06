import React from "react";

export default function EmptyReportView() {
    return (
        <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
                <p className="text-lg font-semibold">No events in timeline</p>
                <p className="text-sm mt-2">Drag events from the left panel to generate a report</p>
            </div>
        </div>
    );
}
