export type CopyStatus = 'idle' | 'success' | 'error';

export interface UseCopyToClipboardResult {
    copyStatus: CopyStatus;
    copyToClipboard: (text: string) => Promise<void>;
    resetStatus: () => void;
}