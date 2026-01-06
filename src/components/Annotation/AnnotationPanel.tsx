'use client'

import React from "react";

// Import local components
import AnnotationHeader from "./AnnotationHeader";
import AnnotationContent from "./AnnotationContent";

export default function AnnotationPanel() {
    // const { state } = useEventContext();

    return (
        <div className="h-90 overflow-hidden flex flex-col border-b border-gray-200">
            <AnnotationHeader />
            <AnnotationContent />
        </div>
    );
}
