> Product Engineer Take-Home Interview Project

## Requirements

1. sift a raw event stream
    - from a local `event.json` that is dragged into the webpage
2. drag the important items into a timeline, 
    - 
3. briefly annotate them, and 
4. export a tidy Markdown snippet ready to drop into Slack


- layout/components
    - triage pane
        - a list of raw events
    - annotation panel
    - timeline visualization
    - markdown export preview & copy

- state
    - global
        - `event.json`
    - local
        - 
    - co-local

## Dev timeline

- started jul 13
- polished jul 14, refactor, documentation, deploy on staging for preview
    - sanitaization: go through each components
        - seaprate complicate code into single componenets/state/utils/hooks
        - prevent having useEffect directly in the page component
    - comments: 
        - on top of the imports
            - `// Import global components and utilities`
            - `// Import local components`
        - `// Global available states`
        - `// Component-only states`
        - `// Component-only event handlers`
        - `// @TODO: ...`
        - on each ternary conditions
    - any errors when ran linting check

## Todo

- [ ] CSS put into design system
- [ ] add notifications