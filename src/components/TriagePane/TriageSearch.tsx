import React from "react";

interface TriageSearchProps {
    search: string;
    setSearch: (v: string) => void;
    typeFilter: string;
    setTypeFilter: (v: string) => void;
    eventListLength: number;
    eventTypes: string[];
    caseSensitive: boolean;
    setCaseSensitive: (v: boolean) => void;
}

export default function TriageSearch({
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    eventListLength,
    eventTypes,
    caseSensitive,
    setCaseSensitive,
}: TriageSearchProps) {
    return (
        <div className="p-4 border-b border-gray-200">
            <label className="flex items-center mb-3 select-none">
                <input
                    type="checkbox"
                    className="mr-2"
                    checked={caseSensitive}
                    onChange={e => setCaseSensitive(e.target.checked)}
                    disabled={eventListLength === 0}
                />
                <span className={
                    `text-sm ${eventListLength === 0 ? 'text-gray-400' : ''}`
                }>
                    Case sensitive
                </span>
            </label>
            <input
                type="text"
                placeholder="Search events..."
                className={
                    `text-sm w-full px-3 py-2 border border-gray-300 rounded bg-white 
                    focus:outline-none focus:ring focus:border-blue-500 
                    ${eventListLength === 0 ?
                        'bg-gray-100 text-gray-400 cursor-not-allowed'
                        :
                        ''
                    }`
                }
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={eventListLength === 0}
            />
            <select
                className={
                    `text-sm mt-2 w-full px-3 py-2 border border-gray-300 rounded bg-white 
                    focus:outline-none focus:ring focus:border-blue-300 
                    ${eventListLength === 0 ?
                        'bg-gray-100 text-gray-400 cursor-not-allowed'
                        :
                        ''
                    }`
                }
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                disabled={eventListLength === 0}
            >
                <option value="">All Event Types</option>
                {eventListLength > 0 && eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
        </div>
    );
}
