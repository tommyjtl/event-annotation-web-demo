/**
 * Utility functions for file upload handling
 */

import { handleFileUpload, ParsedEventsResult } from "./eventUtils";
import { resetFileInput } from "./fileUtils";

export interface UploadHandlerCallbacks {
    onSuccess: (
        esult: ParsedEventsResult
    ) => void;
    onError: (
        error: string
    ) => void;
    onProgress?: (
        progress: number,
        step: string,
        totalItems?: number,
        processedItems?: number
    ) => void;
}

export interface UploadHandlerOptions {
    inputRef?: React.RefObject<HTMLInputElement | null>;
    reuploadInputRef?: React.RefObject<HTMLInputElement | null>;
    measurePerformance?: boolean;
}

export function createUploadHandler(
    callbacks: UploadHandlerCallbacks,
    options: UploadHandlerOptions = {}
) {
    return (file: File) => {
        const startTime = options.measurePerformance ? performance.now() : 0;

        const onSuccess = (result: ParsedEventsResult) => {
            const endTime = options.measurePerformance ? performance.now() : 0;
            const duration = endTime - startTime;

            // Add duration to the result if performance measurement is enabled
            if (options.measurePerformance) {
                result.duration = duration;
            }

            callbacks.onSuccess(result);
        };

        const onError = (error: string) => {
            callbacks.onError(error);
        };

        const onProgress = (
            progress: number,
            step: string,
            totalItems?: number,
            processedItems?: number
        ) => {
            if (callbacks.onProgress) {
                callbacks.onProgress(progress, step, totalItems, processedItems);
            }
        };

        handleFileUpload(file, onSuccess, onError, onProgress);

        // Reset input refs so same file can be uploaded again
        if (options.inputRef) {
            resetFileInput(options.inputRef);
        }
        if (options.reuploadInputRef) {
            resetFileInput(options.reuploadInputRef);
        }
    };
}
