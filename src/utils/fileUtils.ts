/**
 * Utility functions for file operations
 */

// Generic file upload handler
export function uploadFile(
    file: File,
    onSuccess: (content: string) => void,
    onError: (error: string) => void
): void {
    const reader = new FileReader();

    reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
            onSuccess(content);
        } else {
            onError("Failed to read file content");
        }
    };

    reader.onerror = () => {
        onError("Failed to read file");
    };

    // Read the file as text
    reader.readAsText(file);
}

// JSON file upload handler with validation
export function uploadJSONFile<T>(
    file: File,
    validator: (
        data: string,
        onProgress?: (
            progress: number,
            step: string,
            totalItems?: number,
            processedItems?: number
        ) => void
    ) => T,
    onSuccess: (data: T) => void,
    onError: (error: string) => void,
    onProgress?: (
        progress: number,
        step: string,
        totalItems?: number,
        processedItems?: number
    ) => void
): void {
    onProgress?.(5, "Reading file...");

    uploadFile(
        file,
        (content) => {
            try {
                const validatedData = validator(content, onProgress);
                onSuccess(validatedData);
            } catch (error) {
                onError(error instanceof Error ? error.message : "Invalid JSON file");
            }
        },
        onError
    );
}

// Reset file input value
export function resetFileInput(inputRef: React.RefObject<HTMLInputElement | null>): void {
    if (inputRef.current) {
        inputRef.current.value = "";
    }
}
