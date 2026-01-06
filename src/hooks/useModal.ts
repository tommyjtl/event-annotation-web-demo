import { useState } from 'react';

/**
 * Custom hook for managing modal state
 * @param initialState - Initial state of the modal (default: false)
 * @returns Object with isOpen, open, close, and toggle functions
 */
export const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);

    return {
        isOpen,
        open,
        close,
        toggle
    };
};
