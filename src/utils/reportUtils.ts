/**
 * Utility functions for generating reports from event data
 */

import { ReportItem } from "../store/EventContext";

export interface ReportOptions {
    includeEventType?: boolean;
    includeEventShort?: boolean;
    includeNote?: boolean;
}

export function generateRawTextReport(
    reportItems: ReportItem[],
    options: ReportOptions = {}
): string {
    if (reportItems.length === 0) {
        return ""
    }

    const {
        includeEventType = true,
        includeEventShort = true,
        includeNote = true
    } = options

    // Sort report items by event time
    const sortedItems = [...reportItems].sort((a, b) =>
        new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()
    )

    return sortedItems.map(item => {
        const eventTime = new Date(item.eventTime);
        const dateString = eventTime.toLocaleDateString([], {
            month: '2-digit',
            day: '2-digit'
        })
        const timeString = eventTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })

        let line = `- ${dateString} ${timeString}`

        if (includeEventType) {
            line += ` [${item.eventType}]`
        }

        if (includeEventShort) {
            line += ` ${item.eventShort}`
        }

        if (includeNote && item.hasNote && item.noteContent) {
            const noteContent = item.noteContent.replace(/\n/g, '\\n')
            line += ` - ${noteContent}`
        }

        return line

    }).join('\n')
}
