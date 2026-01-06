'use client';

import React, {
  // Suspense 
} from "react";
import { EventProvider } from "@/store/EventContext";

// Lazy load MainContent to reduce initial bundle size
// const MainContent = React.lazy(() => import("@/components/MainContent/MainContent"));
import MainContent from "@/components/MainContent/MainContent";

// Loading fallback component
// const LoadingFallback = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50">
//     <div className="text-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//       <p className="mt-4 text-gray-600">Loading Event Annotation Tool...</p>
//     </div>
//   </div>
// );

export default function Home() {
  return (
    <EventProvider>
      {/* <Suspense fallback={<LoadingFallback />}> */}
      <MainContent />
      {/* </Suspense> */}
    </EventProvider>
  );
}
