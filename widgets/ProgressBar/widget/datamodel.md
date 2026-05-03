## Business Data

The widget expects progress data that can be provided in multiple formats:

### Format 1: Simple Number (0-100)
```javascript
75  // Represents 75% progress
```

### Format 2: ProgressData Object
```javascript
{
  "value": 75,                    // Progress value from 0 to 100
  "status": "Almost there!"       // Optional custom status message
}
```

### Format 3: Alternative Property Name
```javascript
{
  "percentage": 75,               // Alternative to 'value'
  "status": "Processing..."       // Optional custom status message
}
```

## Data Structure

- **Type**: Number (0-100) OR ProgressData Object
- **Required**: Yes
- **Default**: 0 (if no data provided)

## ProgressData Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `value` | Integer | Yes* | Progress value from 0 to 100 representing percentage complete |
| `percentage` | Integer | No | Alternative to `value` - progress percentage from 0 to 100 |
| `status` | String | No | Optional custom status message to override default messages |

*Either `value` or `percentage` must be provided when using object format

## Color-Coded States

The progress bar automatically changes color based on the progress value:

| Range | Color | State | Description |
|-------|-------|-------|-------------|
| 0-49% | 🔴 Red | Low | Initial progress, needs attention |
| 50-74% | 🟡 Yellow | Moderate | Good progress, keep going |
| 75-100% | 🟢 Green | High | Excellent progress, nearly complete |

## Default Status Messages

If no custom status message is provided, the widget displays:

| Progress | Message | State Class |
|----------|---------|-------------|
| 0% | "Not started" | `state-not-started` |
| 1-99% | "In progress..." | `state-in-progress` |
| 100% | "Complete" | `state-complete` |

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showPercentage` | Boolean | `true` | Display the percentage value above the progress bar |
| `showStatus` | Boolean | `true` | Display status message below the progress bar |
| `animated` | Boolean | `true` | Enable smooth transition animations for progress changes |
| `customMessages` | Object | `null` | Custom status messages (see below) |

### Custom Messages Object

```javascript
{
  "notStarted": "Waiting to begin",
  "inProgress": "Working on it...",
  "complete": "All done!"
}
```

## Example Data

### Simple Progress Value
```javascript
// Just a number
50
```

### Basic ProgressData Object
```javascript
{
  "value": 75
}
```

### With Custom Status Message
```javascript
{
  "value": 60,
  "status": "Processing files: 6 of 10 complete"
}
```

### File Upload Progress
```javascript
{
  "value": 45,
  "status": "Uploading document.pdf (4.5 MB of 10 MB)"
}
```

### Task Completion
```javascript
{
  "percentage": 80,
  "status": "4 of 5 tasks completed"
}
```

### Processing Workflow
```javascript
{
  "value": 33,
  "status": "Step 1 of 3: Validating data"
}
```

### Download Progress
```javascript
{
  "value": 92,
  "status": "Download complete in 8 seconds"
}
```

## Events

### progressChanged Event

The widget registers a `progressChanged` boundary event that fires when the progress value changes.

**Event Registration:**
```javascript
this.registerEventHandlingFunction(this, "progressChanged", "value");
```

**Event Data:**
The event passes an object containing:
- `value`: Current progress value (0-100)
- `state`: Current color state ("state-low", "state-moderate", or "state-high")
- `status`: Current status message

**Event Handler Example:**
```javascript
// In your BAW coach event handler for progressChanged
console.log("Progress changed:", value);
console.log("Current state:", value.state);
console.log("Status message:", value.status);

// Trigger actions based on progress
if (value.value === 100) {
  // Progress complete - enable next button
  this.ui.get("nextButton").setEnabled(true);
} else if (value.value >= 50) {
  // Halfway there - show encouragement
  console.log("You're halfway there!");
}
```

**Usage in BAW:**
1. Add the ProgressBar widget to your coach
2. Bind it to a business object or variable
3. Add an event handler for `progressChanged` in the Events tab
4. Use the event data to trigger actions or update other widgets

## Programmatic Updates

The widget provides a public method to update progress programmatically:

```javascript
// Get widget reference
var progressBar = this.ui.get("myProgressBar");

// Update progress
progressBar.updateProgress(75);
```

This method:
- Updates the visual progress bar
- Updates the bound data
- Fires the `progressChanged` event
- Automatically determines color state and status message

## Data Binding in BAW

### Binding to a Simple Variable
```javascript
// Create a variable of type Integer
tw.local.progressValue = 0;

// Bind the widget to this variable
// The widget will display the value as a percentage
```

### Binding to a Business Object
```javascript
// Create a business object with ProgressData structure
tw.local.taskProgress = {
  value: 0,
  status: "Task not started"
};

// Bind the widget to this business object
// The widget will use both value and status
```

### Updating Progress in a Service
```javascript
// In a service flow or script
tw.local.progressValue = 25;  // Updates to 25%

// Or with business object
tw.local.taskProgress.value = 50;
tw.local.taskProgress.status = "Processing step 2 of 4";
```

## Notes

- Progress values are automatically clamped to 0-100 range
- The progress bar includes smooth animations by default
- Color transitions happen automatically based on progress value
- The widget is fully accessible with ARIA attributes
- Supports reduced motion preferences for accessibility
- Responsive design adapts to mobile devices
- The shimmer animation provides visual feedback during progress