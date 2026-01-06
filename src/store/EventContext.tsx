'use client' // For useReducer

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import { Event, EventWithId } from "../types/event";

// Event type
export type EventState = {
    events: Event[];
    selectedEvents: string[]; // array of event ids or times
    selectedEvent: EventWithId | null; // currently selected event
    notes: Note[]; // array of notes
    report: ReportItem[]; // array of report items
};

// Note type
export type Note = {
    _id: string; // corresponds to event _id
    content: string;
    createdAt: string;
    updatedAt: string;
};

// Report item type
export type ReportItem = {
    _id: string; // corresponds to event _id
    eventType: string;
    eventShort: string;
    eventTime: string;
    eventDescription: string;
    eventUser?: string;
    addedToTimelineAt: string;
    hasNote: boolean;
    noteContent?: string;
};

// Action types
export type EventAction =
    | { type: "SET_EVENTS"; payload: Event[] }
    | { type: "ADD_EVENT"; payload: Event }
    | { type: "REMOVE_EVENT"; payload: string } // payload: event id or time
    | { type: "UPDATE_EVENT"; payload: Event }
    // Selected event relevant actions
    | { type: "SET_SELECTED_EVENTS"; payload: string[] }
    | { type: "ADD_SELECTED_EVENT"; payload: string }
    | { type: "REMOVE_SELECTED_EVENT"; payload: string }
    | { type: "SET_SELECTED_EVENT"; payload: EventWithId | null }
    // Event note relevant actions
    | { type: "ADD_NOTE"; payload: { eventId: string; content: string } }
    | { type: "UPDATE_NOTE"; payload: { eventId: string; content: string } }
    | { type: "REMOVE_NOTE"; payload: string } // payload: event id
    // Report relevant actions
    | { type: "ADD_REPORT_ITEM"; payload: Event & { _id: string } }
    | { type: "REMOVE_REPORT_ITEM"; payload: string } // payload: event id
    | {
        type: "UPDATE_REPORT_ITEM_NOTE"; payload: {
            eventId: string;
            hasNote: boolean;
            noteContent?: string
        }
    };

const initialState: EventState = {
    events: [], // initial empty events array, to be populated later with user's uploaded data
    selectedEvents: [], // a list of selected event ids that will appear on the timeline
    selectedEvent: null,
    notes: [], // a list of notes
    report: [], // a list of report items
};

function eventReducer(state: EventState, action: EventAction): EventState {
    switch (action.type) {
        case "SET_EVENTS":
            return { ...state, events: action.payload };
        case "ADD_EVENT":
            return { ...state, events: [...state.events, action.payload] };
        // Not using update or remove actions in this example
        // case "REMOVE_EVENT":
        //     return {
        //         ...state, events: state.events.filter((event) =>
        //             event.time !== action.payload
        //         )
        //     };
        // case "UPDATE_EVENT":
        //     return {
        //         ...state,
        //         events: state.events.map(e => e.time === action.payload.time ? action.payload : e),
        //     };
        case "SET_SELECTED_EVENTS":
            return { ...state, selectedEvents: action.payload };
        case "ADD_SELECTED_EVENT":
            return { ...state, selectedEvents: [...state.selectedEvents, action.payload] };
        case "REMOVE_SELECTED_EVENT":
            return { ...state, selectedEvents: state.selectedEvents.filter(id => id !== action.payload) };
        case "SET_SELECTED_EVENT":
            return { ...state, selectedEvent: action.payload };
        case "ADD_NOTE":
            const newNote: Note = {
                _id: action.payload.eventId,
                content: action.payload.content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return { ...state, notes: [...state.notes, newNote] };
        case "UPDATE_NOTE":
            return {
                ...state,
                notes: state.notes.map(note =>
                    note._id === action.payload.eventId
                        ? { ...note, content: action.payload.content, updatedAt: new Date().toISOString() }
                        : note
                ),
            };
        case "REMOVE_NOTE":
            return { ...state, notes: state.notes.filter(note => note._id !== action.payload) };
        case "ADD_REPORT_ITEM":
            const newReportItem: ReportItem = {
                _id: action.payload._id,
                eventType: action.payload.type,
                eventShort: action.payload.short,
                eventTime: action.payload.time,
                eventDescription: action.payload.description,
                eventUser: action.payload.user,
                addedToTimelineAt: new Date().toISOString(),
                hasNote: false,
                noteContent: undefined,
            };
            return { ...state, report: [...state.report, newReportItem] };
        case "REMOVE_REPORT_ITEM":
            return { ...state, report: state.report.filter(item => item._id !== action.payload) };
        case "UPDATE_REPORT_ITEM_NOTE":
            return {
                ...state,
                report: state.report.map(item =>
                    item._id === action.payload.eventId
                        ? {
                            ...item,
                            hasNote: action.payload.hasNote,
                            noteContent: action.payload.noteContent
                        } : item
                ),
            };
        default:
            return state;
    }
}

const EventContext = createContext<{
    state: EventState;
    dispatch: Dispatch<EventAction>;
} | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(eventReducer, initialState);
    return (
        <EventContext.Provider value={{ state, dispatch }}>
            {children}
        </EventContext.Provider>
    );
};

export function useEventContext() {
    const context = useContext(EventContext);
    if (!context) throw new Error("useEventContext must be used within an EventProvider");
    return context;
}
