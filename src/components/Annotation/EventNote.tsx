import React, { useState, useEffect, useRef } from "react";

// Import global components and utilities
import { useEventContext } from "@/store/EventContext";
import { useCommandKey } from "@/hooks/useKeyboardShortcut";
import type { EventWithId } from "@/types/event";

interface EventNoteProps {
    selectedEvent: EventWithId;
}

export default function EventNote({ selectedEvent }: EventNoteProps) {
    const { state, dispatch } = useEventContext();

    // Local state for the textarea
    const [noteText, setNoteText] = useState("");
    const [showSaveMessage, setShowSaveMessage] = useState(false);

    // Ref for the textarea to enable focus
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Find existing note for selected event
    const existingNote = selectedEvent
        ? state.notes.find(note => note._id === selectedEvent._id)
        : null;

    // Update textarea when selected event changes
    useEffect(() => {
        if (selectedEvent) {
            setNoteText(existingNote?.content || "");
        } else {
            setNoteText("");
        }
    }, [selectedEvent, existingNote]);

    // Handle keyboard shortcut for focusing textarea
    useCommandKey(
        'Enter',
        () => {
            if (selectedEvent && textareaRef.current) {
                textareaRef.current.focus();
            }
        },
        [selectedEvent],
        !!selectedEvent // Only enable when there's a selected event
    );

    // Handle keyboard shortcut for saving note (Command+S)
    useCommandKey(
        's',
        () => {
            handleSaveNote();
        },
        [selectedEvent, noteText],
        !!selectedEvent && !!noteText.trim() // Only enable when there's a selected event and note text
    );

    // Handle save note
    const handleSaveNote = () => {
        if (!selectedEvent || !noteText.trim()) return;

        const eventId = selectedEvent._id;

        if (existingNote) {
            // Update existing note
            dispatch({
                type: "UPDATE_NOTE",
                payload: { eventId, content: noteText.trim() }
            });
        } else {
            // Add new note
            dispatch({
                type: "ADD_NOTE",
                payload: { eventId, content: noteText.trim() }
            });
        }

        // Show save message
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 2000);

        // Update report item with note information
        dispatch({
            type: "UPDATE_REPORT_ITEM_NOTE",
            payload: { eventId, hasNote: true, noteContent: noteText.trim() }
        });
    };

    // Handle clear note
    const handleClearNote = () => {
        setNoteText("");
        if (existingNote && selectedEvent) {
            const eventId = selectedEvent._id;
            dispatch({
                type: "REMOVE_NOTE",
                payload: eventId
            });
            // Update report item to indicate no note
            dispatch({
                type: "UPDATE_REPORT_ITEM_NOTE",
                payload: { eventId, hasNote: false, noteContent: undefined }
            });
        }
    };

    return (
        <div className="w-1/2 p-4 flex flex-col">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Notes:</h4>
            <textarea
                ref={textareaRef}
                className={
                    `flex-1 text-sm resize-none border border-gray-300 
                    rounded-sm p-2.5 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-colors 
                    ${!selectedEvent ?
                        'bg-gray-50 text-gray-400 cursor-not-allowed'
                        :
                        'bg-white text-gray-900'
                    }`
                }
                placeholder="Add your notes here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={!selectedEvent}
            />
            <div className="flex gap-2 mt-3 items-center">
                <button
                    className={
                        `px-3 py-1 text-xs font-medium text-gray-700 
                        bg-gray-200 border border-gray-300 rounded-sm 
                        hover:bg-gray-300 focus:outline-none focus:ring-2 
                        focus:ring-gray-500 focus:ring-offset-2 
                        transition-colors disabled:opacity-50 
                        disabled:cursor-not-allowed`
                    }
                    onClick={handleClearNote}
                    disabled={!selectedEvent || !noteText.trim()}
                >
                    Reset Note
                </button>
                <button
                    className={
                        `px-3 py-1 text-xs font-medium text-white 
                        bg-blue-600 border border-transparent 
                        rounded-sm hover:bg-blue-700 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                        transition-colors 
                        disabled:opacity-50 disabled:cursor-not-allowed`
                    }
                    onClick={handleSaveNote}
                    disabled={!selectedEvent || !noteText.trim()}
                >
                    Save Note
                </button>
                {showSaveMessage && (
                    <span className="ms-1 text-xs text-green-600 font-medium animate-fade-in">
                        Note saved!
                    </span>
                )}
            </div>
        </div>
    );
}
