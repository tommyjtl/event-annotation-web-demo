import React, { useRef } from 'react';

// Import local components
import Button, { ButtonProps } from './general/Button';

interface FileUploadButtonProps extends Omit<ButtonProps, 'onClick'> {
    onFileSelect: (file: File) => void;
    accept?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function FileUploadButton({
    children,
    onFileSelect,
    accept = '*/*',
    inputRef,
    ...buttonProps
}: FileUploadButtonProps) {

    const internalInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = inputRef || internalInputRef;

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <>
            <Button onClick={handleButtonClick} {...buttonProps}>
                {children}
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
            />
        </>
    );
};
