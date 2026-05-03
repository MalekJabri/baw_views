# ProgressBar Widget

An IBM Business Automation Workflow (BAW) custom view widget that displays an animated horizontal progress bar with color-coded states, real-time percentage display, and status messages using Carbon Design System styling.

## Overview

The ProgressBar widget provides a clear visual representation of task completion and progress tracking in IBM BAW applications. It features:

- **Animated horizontal progress bar** with smooth transitions
- **Real-time percentage display** showing current progress
- **Color-coded states** that change automatically based on progress:
  - 🔴 Red (0-49%): Low progress
  - 🟡 Yellow (50-74%): Moderate progress
  - 🟢 Green (75-100%): High progress
- **Dynamic status messages** ("Not started", "In progress...", "Complete")
- **Carbon Design System styling** with authentic IBM design language
- **Data binding** with BAW business objects
- **Event handling** for automatic updates and workflow integration
- **Accessibility support** with ARIA attributes
- **Responsive design** that adapts to different screen sizes
- **Shimmer animation** for visual feedback during progress
- **Reduced motion support** for accessibility preferences

## Visual Representation

```
Progress: 75%
████████████████████████████████████████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░
                                    75%
                              In progress...
```

### Carbon Design System Features

- **Typography**: IBM Plex Sans font family with proper sizing
- **Colors**: IBM Carbon color palette with semantic color states
- **Spacing**: Consistent spacing and padding
- **Animations**: Smooth transitions and shimmer effects
- **Accessibility**: ARIA attributes and reduced motion support

## Configuration Options

The widget accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showPercentage` | Boolean | `true` | Display the percentage value above the progress bar |
| `showStatus` | Boolean | `true` | Display status message below the progress bar |
| `animated` | Boolean | `true` | Enable smooth transition animations for progress changes |
| `customMessages` | Object | `null` | Custom status messages (notStarted, inProgress, complete) |

## Business Data

### Input Data

- **Type**: Number (0-100) OR ProgressData Object
- **Description**: Progress value or object containing progress information
- **Structure**: 
  - Simple number: `75` (represents 75% progress)
  - ProgressData object: `{ value: 75, status: "Processing..." }`

### Example Data Structure

```javascript
// Simple number format
75

// ProgressData object format
{
  "value": 75,
  "status": "Processing files: 3 of 4 complete"
}

// Alternative property name
{
  "percentage": 75,
  "status": "Almost done!"
}
```

### Color States

| Range | Color | State | Description |
|-------|-------|-------|-------------|
| 0-49% | Red | Low | Initial progress, needs attention |
| 50-74% | Yellow | Moderate | Good progress, keep going |
| 75-100% | Green | High | Excellent progress, nearly complete |

## File Structure

```
ProgressBar/
├── README.md                          # This file
├── widget/                            # Widget implementation files
│   ├── Layout.html                    # HTML structure with ARIA support
│   ├── InlineCSS.css                  # Carbon Design System styling
│   ├── inlineJavascript.js            # Initialization and rendering logic
│   ├── config.json                    # Widget metadata
│   ├── ProgressData.json              # Business object definition
│   ├── datamodel.md                   # Data model documentation
│   └── eventHandler.md                # Event handler documentation
└── AdvancePreview/                    # Preview mode implementation
    ├── ProgressBar.html               # Preview HTML
    └── ProgressBar.js                 # Preview generation logic
```

## Usage Examples

### Basic Configuration

1. **Add the ProgressBar widget** to your IBM BAW coach view
2. **Bind the business data** to a number or ProgressData object
3. **Configure the options** as needed

### Example Scenario: File Upload Progress

```javascript
// Business data: uploadProgress
tw.local.uploadProgress = {
  value: 45,
  status: "Uploading document.pdf (4.5 MB of 10 MB)"
};

// Configuration:
showPercentage: true
showStatus: true
animated: true
```

### Example Scenario: Task Completion

```javascript
// Business data: taskProgress
tw.local.taskProgress = {
  value: 80,
  status: "4 of 5 tasks completed"
};

// Configuration:
showPercentage: true
showStatus: true
animated: true
```

### Example Scenario: Simple Progress Value

```javascript
// Business data: simpleProgress (just a number)
tw.local.simpleProgress = 60;

// Configuration:
showPercentage: true
showStatus: true
animated: true
// Status will be auto-generated: "In progress..."
```

### Example Scenario: Custom Status Messages

```javascript
// Business data
tw.local.processProgress = 25;

// Configuration with custom messages:
showPercentage: true
showStatus: true
animated: true
customMessages: {
  notStarted: "Waiting to begin",
  inProgress: "Working on it...",
  complete: "All done!"
}
```

## Technical Details

### CSS Classes

The widget uses the following class structure:

| Class | Purpose |
|-------|---------|
| `progressbar_maincontentbox` | Main container |
| `progressbar-container` | Inner container |
| `progressbar-track` | Progress bar track (background) |
| `progressbar-fill` | Progress bar fill (colored bar) |
| `progressbar-percentage` | Percentage display container |
| `percentage-value` | Percentage text |
| `progressbar-status` | Status message container |
| `status-message` | Status message text |
| `state-low` | Red state modifier (0-49%) |
| `state-moderate` | Yellow state modifier (50-74%) |
| `state-high` | Green state modifier (75-100%) |

### Responsive Breakpoints

```css
@media (max-width: 672px) {
  /* Mobile adjustments */
  - Smaller font sizes
  - Reduced padding
  - Thinner progress bar
}
```

### Animations

The widget includes smooth animations:
- **Progress transition**: 0.5s ease-in-out for width changes
- **Color transition**: 0.3s ease for state color changes
- **Shimmer effect**: 2s infinite animation on progress fill
- **Pulse animation**: 2s infinite on in-progress status

## Color Palette

Following Carbon Design System:

| Element | Color | Hex Code |
|---------|-------|----------|
| Low progress (0-49%) | Red 60 | `#da1e28` |
| Moderate progress (50-74%) | Yellow 30 | `#f1c21b` |
| High progress (75-100%) | Green 60 | `#24a148` |
| Track background | Gray 30 | `#e0e0e0` |
| Percentage text | Gray 100 | `#161616` |
| Status text | Gray 70 | `#525252` |

## Browser Compatibility

The widget uses modern web standards:
- CSS Flexbox for layout
- CSS Animations for transitions
- ES5+ JavaScript

**Recommended browsers**: Chrome 85+, Firefox 90+, Safari 14+, Edge 85+

## Integration with IBM BAW

This widget is designed to be used as a custom Coach View in IBM Business Automation Workflow. To integrate:

1. **Import the widget** into your Process App or Toolkit
2. **Add it to a Coach or Coach View**
3. **Bind the business data** to a number or ProgressData object
4. **Configure the options** (showPercentage, showStatus, etc.)
5. **The widget will automatically update** when the bound data changes

### BAW-Specific Features

- Automatic re-rendering on data change
- Support for BAW navigation methods
- Compatible with BAW's data binding mechanism
- Works with both Coach and Coach View contexts
- Fires `progressChanged` boundary event for integration with coach logic

### Boundary Events

The widget fires a `progressChanged` event when progress updates:

```javascript
// Event data
{
  value: 75,              // Current progress value
  state: "state-high",    // Current color state
  status: "In progress..."  // Current status message
}
```

**To listen to this event:**
1. Add an event handler to your coach
2. Select the ProgressBar widget as the event source
3. Choose "progressChanged" as the event type
4. Access event data via the `value` parameter

## Best Practices

1. **Use meaningful progress values**: Ensure progress accurately reflects task completion
2. **Provide custom status messages**: Add context-specific messages for better UX
3. **Consider mobile users**: Test on smaller screens for readability
4. **Update progress incrementally**: Avoid large jumps in progress values
5. **Use appropriate color states**: Let the widget automatically determine colors
6. **Handle completion**: Trigger actions when progress reaches 100%
7. **Test accessibility**: Verify ARIA attributes work with screen readers

## Programmatic Updates

The widget provides a public method to update progress:

```javascript
// Get widget reference
var progressBar = this.ui.get("myProgressBar");

// Update progress programmatically
progressBar.updateProgress(75);
```

This method:
- Updates the visual progress bar
- Updates the bound data
- Fires the `progressChanged` event
- Automatically determines color state and status message

## Troubleshooting

### Progress not displaying
- Verify the bound data is a number (0-100) or valid ProgressData object
- Check that the widget is properly initialized
- Ensure data binding is configured correctly

### Styling issues
- Confirm InlineCSS.css is loaded
- Check for CSS conflicts with other styles
- Verify Carbon Design System classes are not overridden

### Animation not smooth
- Ensure browser supports CSS animations
- Check that `animated` option is set to `true`
- Verify no JavaScript errors in console

### Event not firing
- Confirm event handler is properly configured
- Check that data is actually changing
- Verify event registration in config.json

## Accessibility Features

- **ARIA attributes**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Live regions**: `aria-live="polite"` for dynamic updates
- **Reduced motion**: Respects `prefers-reduced-motion` preference
- **High contrast**: Supports high contrast mode
- **Semantic HTML**: Proper structure for screen readers

## License

```
Licensed Materials - Property of IBM
5725-C95
(C) Copyright IBM Corporation
```

---

**Version**: 1.0  
**Last Updated**: 2026  
**IBM BAW Compatibility**: IBM Business Automation Workflow v18.0+  
**Carbon Design System**: v11.x compatible

<!-- Made with Bob -->