import React from "react";

// Import global components and utilities
import { useEventContext } from "@/store/EventContext";

// Import local components
import EmptyReportView from "./EmptyReportView";
import ReportView from "./ReportView";
import ReportHeader from "./ReportHeader";

export default function ReportPanel() {
    const { state } = useEventContext();
    const reportItems = state.report;

    return (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ReportHeader />

            <div className="flex-1 pt-3 p-4 overflow-y-auto">
                {reportItems.length === 0 ? (
                    <EmptyReportView />
                ) : (
                    <ReportView reportItems={reportItems} />
                )}
            </div>
        </div>
    );
}
