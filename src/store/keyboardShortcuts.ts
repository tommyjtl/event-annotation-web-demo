export interface KeyboardShortcut {
    key: string;
    description: string;
}

export interface KeyboardShortcutCategory {
    category: string;
    shortcuts: KeyboardShortcut[];
}

export const KeyboardShortcuts: KeyboardShortcutCategory[] = [
    {
        category: "Timeline Navigation",
        shortcuts: [
            { key: "← →", description: "Navigate between events on timeline" },
        ]
    },
    {
        category: "Event Annotation",
        shortcuts: [
            { key: "⌘ + Enter", description: "Focus on note textarea" },
            { key: "⌘ + S", description: "Save note" },
        ]
    },
    {
        category: "General",
        shortcuts: [
            { key: "⌘ + /", description: "Open keyboard shortcuts modal" },
            { key: "Escape", description: "Close modal or deselect event" },
        ]
    }
];
