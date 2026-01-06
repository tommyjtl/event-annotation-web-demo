export type Event = {
    type: string;
    short: string;
    user?: string;
    description: string;
    time: string; // ISO 8601 format
};

export interface EventWithId extends Event {
    _id: string; // Unique identifier for the event
}
