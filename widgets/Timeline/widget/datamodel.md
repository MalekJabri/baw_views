# Timeline Widget - Data Model

## Overview

The Timeline widget displays a vertical timeline of chronological events. It expects an array of `TimelineEvent` objects bound to the widget's data property.

## Data Binding

The widget uses a list binding with the following configuration:

```json
{
  "bindingType": {
    "name": "TimelineData",
    "isList": true,
    "type": "TimelineEvent"
  }
}
```

## TimelineEvent Business Object

Each timeline event is represented by a `TimelineEvent` business object with the following properties:

### Required Properties

#### title (String)
- **Description**: The main text displayed for the timeline event
- **Example**: `"Project Started"`, `"Development Phase"`, `"Release 1.0"`
- **Usage**: This is the primary identifier for the event and should be concise and descriptive

### Optional Properties

#### description (String)
- **Description**: Detailed description or additional context for the event
- **Example**: `"Initial project kickoff and planning phase completed"`
- **Usage**: Provides more information about the event without cluttering the title
- **Display**: Shown below the title in a smaller, lighter font

#### date (String)
- **Description**: Date/time of the event as a formatted string
- **Example**: `"2026-05-05"`, `"May 5, 2026"`, `"2026-05-05T14:30:00"`
- **Usage**: Human-readable date representation
- **Display**: Shown above the title when `showDates` option is enabled
- **Note**: Can be any string format; the widget displays it as-is

#### timestamp (Date)
- **Description**: Date/time of the event as a Date object
- **Example**: `new Date("2026-05-05T14:30:00")`
- **Usage**: Programmatic date representation that gets formatted for display
- **Display**: Automatically formatted using `toLocaleString()` when `showDates` is enabled
- **Note**: Takes precedence over `date` property if both are provided

#### status (String)
- **Description**: Current status of the timeline event
- **Allowed Values**:
  - `"completed"` - Event has been completed (blue checkmark icon)
  - `"current"` - Event is currently active (pulsing blue indicator)
  - `"pending"` - Event is upcoming (gray indicator)
  - `"error"` - Event has an error (red X icon)
  - `"warning"` - Event has a warning (yellow warning icon)
- **Default**: `"pending"` if not specified
- **Usage**: Determines the visual appearance and icon of the event marker

#### icon (String)
- **Description**: Optional custom icon identifier or class name
- **Example**: `"custom-icon-class"`, `"fa-calendar"`
- **Usage**: Reserved for future custom icon support
- **Note**: Currently not used by the widget; status-based icons are used instead

#### metadata (String)
- **Description**: Additional metadata or context information
- **Example**: `"Assigned to: John Doe"`, `"Priority: High"`, `"Duration: 2 weeks"`
- **Usage**: Provides supplementary information about the event
- **Display**: Shown below the description in a smaller, italic font

## Data Access Pattern

The widget accesses the timeline data using BAW's list binding pattern:

```javascript
// CORRECT: Access array through .items property
var timelineData = this.getData().items;

// WRONG: Direct access doesn't work with list bindings
var timelineData = this.getData(); // Returns object, not array
```

This is because BAW automatically wraps list data in an object with an `items` property when `isList: true` is set in the binding configuration.

## Example Data Structures

### Minimal Timeline

```javascript
[
  {
    "title": "Event 1"
  },
  {
    "title": "Event 2"
  },
  {
    "title": "Event 3"
  }
]
```

### Complete Timeline

```javascript
[
  {
    "title": "Project Initiated",
    "description": "Project kickoff meeting held with all stakeholders",
    "date": "January 15, 2026",
    "status": "completed",
    "metadata": "Duration: 2 hours"
  },
  {
    "title": "Requirements Gathering",
    "description": "Completed stakeholder interviews and requirements documentation",
    "timestamp": new Date("2026-02-01T09:00:00"),
    "status": "completed",
    "metadata": "Documents: 15 pages"
  },
  {
    "title": "Development Phase",
    "description": "Active development and implementation in progress",
    "timestamp": new Date("2026-03-01T09:00:00"),
    "status": "current",
    "metadata": "Progress: 65%"
  },
  {
    "title": "Testing & QA",
    "description": "Quality assurance and user acceptance testing",
    "date": "May 1, 2026",
    "status": "pending",
    "metadata": "Estimated duration: 3 weeks"
  },
  {
    "title": "Production Release",
    "description": "Final deployment to production environment",
    "date": "June 15, 2026",
    "status": "pending",
    "metadata": "Target date subject to testing results"
  }
]
```

### Timeline with Status Variety

```javascript
[
  {
    "title": "Database Migration",
    "description": "Successfully migrated to new database system",
    "date": "2026-01-10",
    "status": "completed"
  },
  {
    "title": "API Integration",
    "description": "Integration with third-party API in progress",
    "date": "2026-02-15",
    "status": "current"
  },
  {
    "title": "Security Audit",
    "description": "Critical security vulnerabilities found",
    "date": "2026-03-01",
    "status": "error",
    "metadata": "Action required: Immediate"
  },
  {
    "title": "Performance Testing",
    "description": "Performance below target thresholds",
    "date": "2026-03-15",
    "status": "warning",
    "metadata": "Optimization needed"
  },
  {
    "title": "User Training",
    "description": "End-user training sessions scheduled",
    "date": "2026-04-01",
    "status": "pending"
  }
]
```

## Default Data

If no data is bound to the widget, it displays a default timeline with sample events:

```javascript
[
  {
    "title": "Project Started",
    "description": "Initial project kickoff and planning phase",
    "date": "2026-01-15",
    "status": "completed"
  },
  {
    "title": "Development Phase",
    "description": "Active development and implementation",
    "date": "2026-03-01",
    "status": "current"
  },
  {
    "title": "Testing & QA",
    "description": "Quality assurance and testing phase",
    "date": "2026-05-01",
    "status": "pending"
  },
  {
    "title": "Production Release",
    "description": "Final deployment to production",
    "date": "2026-06-15",
    "status": "pending"
  }
]
```

## Data Validation

The widget handles missing or invalid data gracefully:

- **Missing title**: Displays `"Event N"` where N is the event index + 1
- **Missing status**: Defaults to `"pending"`
- **Missing date/timestamp**: Date section is not displayed
- **Empty array**: Displays default sample timeline
- **Null/undefined data**: Displays default sample timeline

## Best Practices

1. **Always provide titles**: Titles are the primary identifier for events
2. **Use consistent date formats**: Choose either `date` or `timestamp` and use consistently
3. **Status values**: Use the predefined status values for consistent visual representation
4. **Description length**: Keep descriptions concise (1-2 sentences) for better readability
5. **Metadata usage**: Use for supplementary information that doesn't fit in the description
6. **Chronological order**: Provide events in chronological order for logical timeline flow
7. **Status progression**: Use status values that reflect the actual state of events

## Related Documentation

- See [`README.md`](../README.md) for widget features and configuration options
- See [`eventHandler.md`](eventHandler.md) for event handling details
- See [`TimelineEvent.json`](TimelineEvent.json) for the business object definition

---

Made with Bob