import { useState, useEffect } from 'react';

// Import global components and utilities
import { copyToClipboard, ClipboardResult } from '@/utils/clipboardUtils';
import { CopyStatus, UseCopyToClipboardResult } from '@/types/report';

/**
 * Custom hook for managing clipboard operations with status tracking
 * @param resetDelay - Time in milliseconds to automatically reset status (default: 2000ms)
 * @returns Object with copyStatus, copyToClipboard function, and resetStatus function
 */
export const useCopyToClipboard = (resetDelay: number = 2000): UseCopyToClipboardResult => {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

    const handleCopyToClipboard = async (text: string): Promise<void> => {
        const result: ClipboardResult = await copyToClipboard(text);
        if (result.success) {
            setCopyStatus('success');
        } else {
            setCopyStatus('error');
            console.error('Failed to copy to clipboard:', result.error);
        }
    };

    const resetStatus = () => {
        setCopyStatus('idle');
    };

    // Auto-reset status after specified delay
    useEffect(() => {
        if (copyStatus !== 'idle') {
            const timer = setTimeout(() => setCopyStatus('idle'), resetDelay);
            return () => clearTimeout(timer);
        }
    }, [copyStatus, resetDelay]);

    return {
        copyStatus,
        copyToClipboard: handleCopyToClipboard,
        resetStatus,
    };
};
