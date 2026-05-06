# Timeline Widget

A vertical timeline widget for displaying chronological events in IBM Business Automation Workflow. The widget provides a clean, visual representation of events with support for status indicators, dates, descriptions, and interactive features.

## Features

- **Vertical Timeline Layout**: Events displayed in chronological order with a connecting line
- **Status Indicators**: Visual markers for different event states (completed, current, pending, error, warning)
- **Date Display**: Optional date/time information for each event
- **Rich Content**: Support for titles, descriptions, and metadata
- **Interactive Events**: Optional click handling for timeline events
- **Flexible Layouts**: Standard or alternate (zigzag) layout options
- **Compact Mode**: Space-efficient display for dense timelines
- **Responsive Design**: Adapts to different screen sizes
- **Carbon Design System**: Follows IBM Carbon design principles

## Configuration Options

### showDates (Boolean)
- **Default**: `true`
- **Description**: Display date/time information for each event
- When enabled, shows formatted date/time above each event title

### showIcons (Boolean)
- **Default**: `true`
- **Description**: Display status icons for events
- Shows visual indicators based on event status (checkmark for completed, etc.)

### alternateLayout (Boolean)
- **Default**: `false`
- **Description**: Alternate event positions (left/right) for visual variety
- Creates a zigzag pattern with events alternating sides of the timeline
- Automatically disabled on mobile devices for better readability

### compact (Boolean)
- **Default**: `false`
- **Description**: Use compact spacing for timeline events
- Reduces vertical spacing and marker sizes for denser timelines

### clickable (Boolean)
- **Default**: `false`
- **Description**: Enable click interaction on timeline events
- When enabled, events become clickable and fire the `eventClicked` event

## Events

### eventClicked
- **Parameter**: `index` (Integer)
- **Description**: Fired when a timeline event is clicked (when `clickable` is enabled)
- Provides the index of the clicked event and event data

## Data Model

The widget expects an array of `TimelineEvent` objects with the following structure:

```javascript
{
  "title": "Event Title",              // Required: Main text for the event
  "description": "Event description",  // Optional: Detailed description
  "date": "2026-05-05",               // Optional: Date string
  "timestamp": Date,                   // Optional: Date object
  "status": "completed",              // Optional: completed, current, pending, error, warning
  "icon": "custom-icon",              // Optional: Custom icon identifier
  "metadata": "Additional info"       // Optional: Extra context information
}
```

### Status Values

- **completed**: Event has been completed (blue checkmark icon)
- **current**: Event is currently active (pulsing blue indicator)
- **pending**: Event is upcoming (gray indicator)
- **error**: Event has an error (red X icon)
- **warning**: Event has a warning (yellow warning icon)

## Usage Examples

### Basic Timeline

```javascript
// Simple timeline with default settings
var timelineData = [
  {
    title: "Project Started",
    description: "Initial project kickoff",
    date: "2026-01-15",
    status: "completed"
  },
  {
    title: "Development Phase",
    description: "Active development",
    date: "2026-03-01",
    status: "current"
  },
  {
    title: "Testing Phase",
    description: "QA and testing",
    date: "2026-05-01",
    status: "pending"
  }
];
```

### Interactive Timeline

```javascript
// Timeline with click handling
var timelineData = [
  {
    title: "Milestone 1",
    description: "First major milestone",
    date: "2026-02-01",
    status: "completed"
  },
  {
    title: "Milestone 2",
    description: "Second major milestone",
    date: "2026-04-01",
    status: "current"
  }
];

// Enable clickable option
// Handle eventClicked event to respond to user interactions
```

### Compact Timeline

```javascript
// Dense timeline with many events
var timelineData = [
  { title: "Event 1", date: "2026-01-01", status: "completed" },
  { title: "Event 2", date: "2026-01-05", status: "completed" },
  { title: "Event 3", date: "2026-01-10", status: "completed" },
  { title: "Event 4", date: "2026-01-15", status: "current" },
  { title: "Event 5", date: "2026-01-20", status: "pending" },
  { title: "Event 6", date: "2026-01-25", status: "pending" }
];

// Enable compact mode for better space utilization
```

## Styling

The widget uses Carbon Design System colors and follows IBM design guidelines:

- **Primary Blue**: `#0f62fe` (completed, current states)
- **Gray**: `#c6c6c6` (pending state)
- **Red**: `#da1e28` (error state)
- **Yellow**: `#f1c21b` (warning state)
- **Text Colors**: Carbon gray scale

## Accessibility

- Semantic HTML structure
- Clear visual hierarchy
- Sufficient color contrast
- Keyboard navigation support (when clickable)
- Screen reader friendly content

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with appropriate polyfills)
- Responsive design for mobile and tablet devices

## Best Practices

1. **Keep Titles Concise**: Use short, descriptive titles for better readability
2. **Use Descriptions Wisely**: Provide additional context without overwhelming users
3. **Status Consistency**: Use status values consistently across your timeline
4. **Date Formatting**: Provide dates in a consistent format
5. **Event Count**: For long timelines, consider pagination or filtering
6. **Compact Mode**: Use for timelines with many events in limited space
7. **Alternate Layout**: Best for timelines with 4-10 events for visual interest

## Related Widgets

- **Stepper**: For step-by-step process flows
- **ProgressBar**: For single progress indicators
- **Breadcrumb**: For navigation paths

## Version History

- **1.0.0** (2026-05-05): Initial release
  - Vertical timeline layout
  - Status indicators and icons
  - Date display support
  - Interactive events
  - Alternate and compact layouts
  - Responsive design

---

Made with Bob