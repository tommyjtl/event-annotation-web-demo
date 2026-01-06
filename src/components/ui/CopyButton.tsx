import React from 'react';

// Import global components and utilities
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

// Import local components
import Button, { ButtonProps } from './general/Button';

interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
    text: string;
    children?: React.ReactNode;
    successText?: string;
    errorText?: string;
    defaultText?: string;
    resetDelay?: number;
}

export default function CopyButton({
    text,
    children,
    successText = 'Copied!',
    errorText = 'Failed',
    defaultText = 'Copy',
    resetDelay = 2000,
    ...buttonProps
}: CopyButtonProps) {
    const { copyStatus, copyToClipboard } = useCopyToClipboard(resetDelay);

    const handleCopy = async () => {
        await copyToClipboard(text);
    };

    const getButtonText = () => {
        if (children) return children;

        switch (copyStatus) {
            case 'success':
                return successText;
            case 'error':
                return errorText;
            default:
                return defaultText;
        }
    };

    const getButtonVariant = (): ButtonProps['variant'] => {
        switch (copyStatus) {
            case 'success':
                return 'secondary'; // Could be customized
            case 'error':
                return 'outline'; // Could be customized
            default:
                return buttonProps.variant || 'primary';
        }
    };

    return (
        <Button
            {...buttonProps}
            onClick={handleCopy}
            variant={getButtonVariant()}
            disabled={buttonProps.disabled}
        >
            {getButtonText()}
        </Button>
    );
};
