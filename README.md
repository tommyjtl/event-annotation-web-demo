# Event Annotation Tools

This was a take-home project for a Product Engineer role I interviewed for a while ago. It's a web application for visualizing, triaging, and annotating time-series events with an interactive timeline, allowing users to import event data, filter and search through events, and generate reports from annotated events.

![](./data/Screenshot%202025-07-14%20at%2023.19.45.png)

![](./data/Screenshot%202025-07-14%20at%2023.49.46.png)

Below are some of the notes doing the implementation.

---

## Timeline

Spent roughly 8 hours for finishing the entire project. Here is the timeline:

- **July 13** at night:
    - Constructing/settling the basic layout.
    - Roughly 70% finished; the following areas are unfinished: event annotation & report tool.
- **July 14** in the morning & night:
    - Finalized the remaining 30% of the requirements.
    - Create new dummy data `.json` for testing the loading speed.
        - Added pagination
        - Added loading progress modal
        - Can import 2000+ events and render without lagging
    - Optimize build
        - Million for debug/analyze
        - Add options in `next.config.ts`
        - Use suspense for fallbacking main content
        - Remove `nanoid` with a customize Math-only function for unique id genegeration
    - Refactored and wrote documentation:
        - Code sanitization: go through each component.
        - Completed comments for the use of helper functions, types, hooks, components, etc.
        - Fixed any errors found by the linting check.
    - Deployed on staging for preview.
- Can be further improved
    - Refactoring left to do:
        - Reduce the amount of `useState`s used.
    - When two events are too close, no improved UX is designed for that scenario.
    - No dark theme.
    - Currently only has stats for the number of failures, but you can't view the details.
    - Internationalization.
    - Test cases needed: E2E tests, component tests
    - Draggable/resizable layout for the different panes
    - Performance: replace `dndkit` with default [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

### Performance

```shell
tommyjtl@tjtl-macbook-975 ~/D/Projects/resolveai-take-home $ npm run build

> resolveai-take-home@0.1.0 build
> next build

   ▲ Next.js 15.3.5

   Creating an optimized production build ...
 ✓ Compiled successfully in 0ms
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                                 Size  First Load JS    
┌ ○ /                                    1.11 kB       > 102 kB <
└ ○ /_not-found                            978 B         102 kB
+ First Load JS shared by all             101 kB
  ├ chunks/4bd1b696-108e698b9d43b6e4.js  53.2 kB
  ├ chunks/684-d9fee429d566156f.js       46.1 kB
  └ other shared chunks (total)          2.02 kB

○  (Static)  prerendered as static content
```

> To be further discussed in the meeting.

## Project Details

### Getting Started

```shell
# Install dependencies
npm install

# Run the project
npm run dev

# Build the project
npm run build
```

### Libraries Used

- [dnd kit](https://dndkit.com) for dragging and dropping cards.
- [Tailwind CSS](https://tailwindcss.com/docs/) for styling

### File Structure

```shell
$ tre -l 4
.
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── Annotation
│   │   ├── AnnotationContent.tsx
│   │   ├── AnnotationHeader.tsx
│   │   ├── AnnotationPanel.tsx
│   │   ├── EventDetail.tsx
│   │   └── EventNote.tsx
│   ├── EventsTimeline
│   │   ├── EventsTimelinePanel.tsx
│   │   ├── TimelineFooter.tsx
│   │   ├── TimelineHeader.tsx
│   │   ├── TimelineVisualization.tsx
│   │   └── TimelineVisualizationComponents
│   │       ├── AnimatedSelectionCircle.tsx
│   │       ├── EventTooltip.tsx
│   │       ├── TimelineLeftSide.tsx
│   │       ├── TimelineRightSide.tsx
│   │       └── index.ts
│   ├── Header
│   │   └── Header.tsx
│   ├── MainContent
│   │   └── MainContent.tsx
│   ├── Report
│   │   ├── EmptyReportView.tsx
│   │   ├── ReportHeader.tsx
│   │   ├── ReportPanel.tsx
│   │   └── ReportView.tsx
│   ├── TriagePane
│   │   ├── TriageEmptyView.tsx
│   │   ├── TriageEventList.tsx
│   │   ├── TriageMainContentView.tsx
│   │   ├── TriagePane.tsx
│   │   ├── TriagePaneFooter.tsx
│   │   └── TriageSearch.tsx
│   └── ui
│       ├── CopyButton.tsx
│       ├── EventCard.tsx
│       ├── FileUploadButton.tsx
│       ├── ImportProgressModal.tsx
│       ├── KeyboardShortcutsModal.tsx
│       ├── general
│       │   ├── Button.tsx
│       │   ├── Modal.tsx
│       │   ├── Pagination.tsx
│       │   └── SectionHeader.tsx
│       ├── icons
│       │   ├── CloseIcon.tsx
│       │   └── index.ts
│       └── index.ts
├── hooks
│   ├── useCopyToClipboard.ts
│   ├── useDotSizeControl.ts
│   ├── useKeyboardShortcut.ts
│   ├── useModal.ts
│   └── useTriageFilter.ts
├── store
│   ├── EventContext.tsx
│   ├── Timeline.ts
│   └── keyboardShortcuts.ts
├── types
│   ├── event.ts
│   ├── report.ts
│   └── timeline.ts
└── utils
    ├── clipboardUtils.ts
    ├── dragUtils.ts
    ├── eventUtils.ts
    ├── fileUtils.ts
    ├── reportUtils.ts
    └── uploadUtils.ts
```

## AI Tool Usage Acknowledgement

AI tools is used mostly for these tasks in this project:

- Generating CSS layout
- Generating some utility functions and customized hooks
- Refactoring some code into separate React components
- Generating the comments for the file structure
- `!EOF`