# Timeline Widget - Event Handler Documentation

## Overview

The Timeline widget supports event handling for user interactions with timeline events. This document describes the available events and how to handle them in IBM Business Automation Workflow.

## Available Events

### eventClicked

**Description**: Fired when a user clicks on a timeline event (only when the `clickable` configuration option is enabled).

**Event Configuration**:
```json
{
  "name": "eventClicked",
  "type": "Event",
  "label": "Event Clicked",
  "description": "Event fired when a timeline event is clicked",
  "parameterName": "index"
}
```

**Event Data**:
- `index` (Integer): Zero-based index of the clicked event in the timeline data array
- `event` (Object): The complete event object that was clicked

**When Fired**:
- User clicks on any part of a timeline event (marker, title, description, etc.)
- Only fires when `clickable` configuration option is set to `true`
- Does not fire for disabled events (if implemented in future versions)

## Event Registration

The widget registers the event handler using BAW's event handling system:

```javascript
this.registerEventHandlingFunction(this, "eventClicked", "index");
```

This allows the event to be bound to coach view event handlers in the BAW Designer.

## Event Handling in BAW

### In Coach View Designer

1. Select the Timeline widget in your coach view
2. In the Events section, find the "Event Clicked" event
3. Click the "+" button to add an event handler
4. Choose to either:
   - Create a new service flow
   - Select an existing service flow
   - Add inline JavaScript code

### Event Handler Parameters

The event handler receives the following parameters:

- **index**: The zero-based index of the clicked event
- **event**: The complete event object with all its properties

### Example Event Handler (Service Flow)

```javascript
// Input variables:
// - index (Integer): Index of clicked event
// - event (TimelineEvent): The clicked event object

// Example: Log the clicked event
console.log("Timeline event clicked:", index, event);

// Example: Navigate based on event
if (event.status === "completed") {
    // Navigate to details page
    tw.local.selectedEventIndex = index;
    tw.local.selectedEvent = event;
}

// Example: Update event status
if (event.status === "pending") {
    event.status = "current";
    // Update the timeline data to reflect the change
    tw.local.timelineData[index] = event;
}
```

### Example Event Handler (Inline JavaScript)

```javascript
// Access the event data
var clickedIndex = event.index;
var clickedEvent = event.event;

// Log to console
console.log("Clicked event at index:", clickedIndex);
console.log("Event title:", clickedEvent.title);

// Update a bound variable
me.ui.set("selectedEventIndex", clickedIndex);
me.ui.set("selectedEventTitle", clickedEvent.title);

// Fire another boundary event
me.ui.fireEvent("timelineEventSelected", {
    index: clickedIndex,
    title: clickedEvent.title,
    status: clickedEvent.status
});
```

## Use Cases

### 1. Event Details Navigation

When a user clicks on a timeline event, navigate to a details page:

```javascript
// Event handler
var eventIndex = event.index;
var eventData = event.event;

// Store selected event
tw.local.selectedEvent = eventData;

// Navigate to details coach
tw.system.navigate("EventDetailsCoach");
```

### 2. Status Update

Allow users to mark events as completed by clicking:

```javascript
// Event handler
var eventIndex = event.index;
var eventData = event.event;

// Update status
if (eventData.status === "pending") {
    eventData.status = "completed";
    
    // Update the timeline data
    tw.local.timelineData[eventIndex] = eventData;
    
    // Refresh the widget
    me.ui.refresh();
}
```

### 3. Conditional Actions

Perform different actions based on event status:

```javascript
// Event handler
var eventData = event.event;

switch (eventData.status) {
    case "completed":
        // Show event history
        me.ui.fireEvent("showEventHistory", { event: eventData });
        break;
    case "current":
        // Show event progress
        me.ui.fireEvent("showEventProgress", { event: eventData });
        break;
    case "pending":
        // Show event planning
        me.ui.fireEvent("showEventPlanning", { event: eventData });
        break;
    case "error":
        // Show error details
        me.ui.fireEvent("showErrorDetails", { event: eventData });
        break;
}
```

### 4. Multi-Event Selection

Track multiple selected events:

```javascript
// Initialize selected events array if not exists
if (!tw.local.selectedEvents) {
    tw.local.selectedEvents = [];
}

// Event handler
var eventIndex = event.index;
var eventData = event.event;

// Toggle selection
var existingIndex = tw.local.selectedEvents.findIndex(function(e) {
    return e.title === eventData.title;
});

if (existingIndex >= 0) {
    // Remove from selection
    tw.local.selectedEvents.splice(existingIndex, 1);
} else {
    // Add to selection
    tw.local.selectedEvents.push(eventData);
}

// Update UI
me.ui.set("selectedCount", tw.local.selectedEvents.length);
```

## Event Flow Example

```
User clicks timeline event
    ↓
Widget fires "eventClicked" event
    ↓
BAW event handler receives event data
    ↓
Handler processes the event (update data, navigate, etc.)
    ↓
Widget refreshes if data changed
```

## Best Practices

1. **Enable Clickable**: Set `clickable` configuration option to `true` to enable event handling
2. **Validate Event Data**: Always check that event data exists before processing
3. **Provide Feedback**: Give visual feedback when events are clicked (status change, highlight, etc.)
4. **Error Handling**: Wrap event handlers in try-catch blocks for robustness
5. **Performance**: Keep event handlers lightweight for responsive UI
6. **Accessibility**: Ensure keyboard navigation works alongside click events
7. **State Management**: Update bound data properly to reflect changes in the timeline

## Debugging Event Handlers

### Console Logging

```javascript
// Log event details
console.log("Event clicked:", {
    index: event.index,
    title: event.event.title,
    status: event.event.status,
    timestamp: new Date()
});
```

### Breakpoints

Set breakpoints in your event handler code in the browser developer tools to inspect event data.

### Event Tracing

```javascript
// Add tracing to track event flow
tw.local.eventLog = tw.local.eventLog || [];
tw.local.eventLog.push({
    timestamp: new Date(),
    eventIndex: event.index,
    eventTitle: event.event.title,
    action: "clicked"
});
```

## Future Enhancements

Potential future event types:

- `eventHover`: Fired when user hovers over an event
- `eventDoubleClick`: Fired on double-click
- `eventRightClick`: Fired on right-click for context menu
- `statusChanged`: Fired when event status changes programmatically
- `eventAdded`: Fired when new event is added to timeline
- `eventRemoved`: Fired when event is removed from timeline

## Related Documentation

- See [`README.md`](../README.md) for widget features and configuration
- See [`datamodel.md`](datamodel.md) for data structure details
- See [`config.json`](config.json) for event configuration

---

Made with Bob