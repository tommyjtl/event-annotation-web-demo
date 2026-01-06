import { useEffect, useCallback, useMemo } from 'react';

/*
    This file provides hooks for managing keyboard shortcuts in a React application.
    - useKeyboardShortcut: For single or multiple keyboard shortcuts.
    - useKeyboardShortcuts: For handling multiple shortcuts at once.
    - useCommandKey: For Command/Ctrl + key combinations.
    - useKeyboardShortcutBuilder: For a fluent API to build and register shortcuts.
*/

interface KeyboardShortcutOptions {
    key: string;
    ctrlKey?: boolean; // For Windows/Linux Ctrl key
    metaKey?: boolean; // For Mac Command key
    shiftKey?: boolean; // For Shift key
    altKey?: boolean; // For Alt key
    preventDefault?: boolean; // Whether to prevent default browser behavior
    enabled?: boolean; // Whether the shortcut is enabled
}

interface KeyboardShortcut {
    options: KeyboardShortcutOptions;
    callback: (event: KeyboardEvent) => void;
    deps?: React.DependencyList; // Dependencies for the effect
}

/**
 * Custom hook for handling keyboard shortcuts
 * Supports both single shortcut and multiple shortcuts
 */
export function useKeyboardShortcut(
    shortcut: KeyboardShortcutOptions | KeyboardShortcut,
    callback?: (event: KeyboardEvent) => void,
    deps: React.DependencyList = []
) {
    // Handle both single shortcut and shortcut object formats
    const shortcutConfig = useMemo(() => {
        return 'options' in shortcut ? shortcut : {
            options: shortcut,
            callback: callback!,
            deps
        };
    }, [shortcut, callback, deps]);

    // Destructure options with defaults
    const {
        key,
        ctrlKey = false,
        metaKey = false,
        shiftKey = false,
        altKey = false,
        preventDefault = true,
        enabled = true
    } = shortcutConfig.options;

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Check if all modifier keys match
        const modifiersMatch =
            event.ctrlKey === ctrlKey &&
            event.metaKey === metaKey &&
            event.shiftKey === shiftKey &&
            event.altKey === altKey;

        // Check if the key matches
        const keyMatches = event.key === key;

        if (modifiersMatch && keyMatches) {
            if (preventDefault) {
                event.preventDefault();
            }
            shortcutConfig.callback(event);
        }
    }, [key, ctrlKey, metaKey, shiftKey, altKey, preventDefault, shortcutConfig]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, handleKeyDown, shortcutConfig.deps]);
}

/**
 * Custom hook for handling multiple keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcuts to register
 */
export function useKeyboardShortcuts(
    shortcuts: KeyboardShortcut[]
) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        shortcuts.forEach(({ options, callback }) => {
            const {
                key,
                ctrlKey = false,
                metaKey = false,
                shiftKey = false,
                altKey = false,
                preventDefault = true,
                enabled = true
            } = options;

            if (!enabled) return;

            // Check if all modifier keys match
            const modifiersMatch =
                event.ctrlKey === ctrlKey &&
                event.metaKey === metaKey &&
                event.shiftKey === shiftKey &&
                event.altKey === altKey;

            // Check if the key matches
            const keyMatches = event.key === key;

            if (modifiersMatch && keyMatches) {
                if (preventDefault) {
                    event.preventDefault();
                }
                callback(event);
            }
        });
    }, [shortcuts]);

    useEffect(() => {
        const enabledShortcuts = shortcuts.filter(s => s.options.enabled !== false);
        if (enabledShortcuts.length === 0) return;

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, shortcuts]);
}

/**
 * Convenience hook for Command/Ctrl + key combinations
 * @param key - The key to combine with Command/Ctrl
 * @param callback - Function to execute when the shortcut is pressed
 * @param deps - Dependencies array for the useEffect hook
 * @param enabled - Whether the shortcut is enabled
 */
export function useCommandKey(
    key: string,
    callback: (event: KeyboardEvent) => void,
    deps: React.DependencyList = [],
    enabled: boolean = true
) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Check for Command + key (Mac) or Ctrl + key (Windows/Linux)
        if ((event.metaKey || event.ctrlKey) && event.key === key) {
            event.preventDefault();
            callback(event);
        }
    }, [key, callback]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, handleKeyDown, deps]);
}

/**
 * Hook that provides a fluent API for building keyboard shortcuts
 */
export function useKeyboardShortcutBuilder() {
    const shortcuts: KeyboardShortcut[] = [];

    const builder = {
        /**
         * Add a keyboard shortcut
         */
        add: (
            options: KeyboardShortcutOptions,
            callback: (event: KeyboardEvent) => void,
            deps?: React.DependencyList
        ) => {
            shortcuts.push({ options, callback, deps });
            return builder;
        },

        /**
         * Add a command key shortcut (Ctrl/Cmd + key)
         */
        addCommand: (
            key: string,
            callback: (
                event: KeyboardEvent) => void,
            deps?: React.DependencyList,
            enabled: boolean = true
        ) => {
            shortcuts.push({
                options: {
                    key,
                    ctrlKey: true,
                    metaKey: true,
                    enabled
                },
                callback,
                deps
            });
            return builder;
        },

        /**
         * Add an arrow key shortcut
         */
        addArrow: (
            direction: 'left' | 'right' | 'up' | 'down',
            callback: (event: KeyboardEvent) => void,
            deps?: React.DependencyList,
            enabled: boolean = true
        ) => {
            const keyMap = {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                up: 'ArrowUp',
                down: 'ArrowDown'
            };

            shortcuts.push({
                options: {
                    key: keyMap[direction],
                    enabled
                },
                callback,
                deps
            });
            return builder;
        }
    };

    // Register all shortcuts immediately (not in a build function)
    useKeyboardShortcuts(shortcuts);

    return builder;
}
