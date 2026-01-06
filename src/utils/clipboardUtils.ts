/**
 * Utility functions for clipboard operations
 */

export type ClipboardResult = {
    success: boolean;
    error?: string;
};

/**
 * Copy text to clipboard using the Clipboard API
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to a result object indicating success/failure
 */
export const copyToClipboard = async (text: string): Promise<ClipboardResult> => {
    try {
        await navigator.clipboard.writeText(text);
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to copy to clipboard';
        console.error('Failed to copy to clipboard:', error);
        return { success: false, error: errorMessage };
    }
};

/**
 * Copy text to clipboard with fallback for older browsers
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to a result object indicating success/failure
 */
export const copyToClipboardWithFallback = async (text: string): Promise<ClipboardResult> => {
    // Try modern clipboard API first
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        return copyToClipboard(text);
    }

    // Fallback for older browsers
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            return { success: true };
        } else {
            return { success: false, error: 'Copy command failed' };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to copy to clipboard';
        console.error('Failed to copy to clipboard (fallback):', error);
        return { success: false, error: errorMessage };
    }
};

/**
 * Check if clipboard API is available
 * @returns boolean indicating if clipboard API is supported
 */
export const isClipboardSupported = (): boolean => {
    return !!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function');
};
