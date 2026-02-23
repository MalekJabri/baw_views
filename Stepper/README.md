# Stepper Widget

An IBM Business Automation Workflow (BAW) custom view widget that displays a vertical multi-step process indicator with visual progress tracking using Carbon Design System styling.

## Overview

The Stepper widget provides a clear visual representation of multi-step processes in IBM BAW applications. It features:

- **Carbon Design System styling** with authentic IBM design language
- **Vertical layout** optimized for process flows
- **Dynamic step generation** from array data
- **Visual status indicators** (completed, current, pending, error, warning, disabled)
- **Configurable display options** (numbers, icons, clickable steps)
- **Responsive design** that adapts to different screen sizes
- **Accessibility support** with semantic HTML
- **Animated transitions** with smooth step progression
- **Custom click handlers** for interactive navigation

## Visual Representation

```
1 ● Step 1
  ┃ Completed
  ┃
2 ● Step 2
  ┃ Current (pulsing)
  ┃
3 ○ Step 3
  ┃ Pending
  ┃
4 ○ Step 4
    Pending
```

### Carbon Design System Features

- **Typography**: IBM Plex Sans font family with proper sizing
- **Colors**: IBM Carbon color palette (Blue 60 for active, Gray for pending)
- **Spacing**: Consistent spacing between steps
- **Status indicators**: Circular badges with icons or numbers
- **Connector lines**: Visual connection between steps
- **Hover states**: Interactive feedback for clickable steps
- **Animations**: Smooth pulsing animation on current step

## Configuration Options

The widget accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showNumbers` | Boolean | `true` | Display step numbers in circles (hidden when status icons are shown) |
| `showIcons` | Boolean | `true` | Display status icons (checkmark for completed, error/warning icons) |
| `clickable` | Boolean | `false` | Enable click interaction on steps (disabled steps are never clickable) |
| `currentStep` | Integer | `0` | Index of the current step (0-based). Used for auto-determining status |

## Business Data

### Input Data

- **Type**: Array of Objects
- **Description**: An array of step items representing the process stages
- **Structure**: Each item contains:
  - `label` or `text`: Display text for the step
  - `description`: Optional description text (optional)
  - `status`: Step status (optional, auto-determined if not provided)
  - `onClick`: Custom click handler function (optional)

### Example Data Structure

```javascript
[
  {
    "label": "Personal Information",
    "description": "Enter your details",
    "status": "completed"
  },
  {
    "label": "Address",
    "description": "Provide your address",
    "status": "current"
  },
  {
    "label": "Payment",
    "description": "Payment details",
    "status": "pending"
  },
  {
    "label": "Review",
    "description": "Review and submit",
    "status": "pending"
  }
]
```

### Status Values

| Status | Description | Visual Indicator |
|--------|-------------|------------------|
| `completed` | Step is completed | Blue filled circle with checkmark icon |
| `current` | Step is currently active | Blue outlined circle with pulsing animation |
| `pending` | Step is not yet started | Gray outlined circle with step number |
| `error` | Step has an error | Red filled circle with error icon |
| `warning` | Step has a warning | Yellow filled circle with warning icon |
| `disabled` | Step is disabled | Gray filled circle, not clickable |

## File Structure

```
Stepper/
├── README.md                          # This file
├── widget/                            # Widget implementation files
│   ├── Layout.html                    # HTML structure
│   ├── InlineCSS.css                  # Carbon Design System styling
│   ├── inlineJavascript.js            # Initialization and rendering logic
│   ├── datamodel.md                   # Data model documentation
│   └── eventHandler.md                # Event handler documentation
└── AdvancePreview/                    # Preview mode implementation
    ├── Stepper.html                   # Preview styles
    └── StepperSnippet.js              # Preview generation logic
```

## Component Files

### Layout.html
Defines the HTML structure:
```html
<div class="stepper_maincontentbox">
  <div class="stepper-container">
    <div class="stepper-list">
      <!-- Stepper items dynamically generated -->
    </div>
  </div>
</div>
```

### InlineCSS.css
Contains Carbon Design System styling:
- Step circle and connector line styling
- Status-based color coding
- Hover and focus states
- Responsive breakpoints for mobile devices
- Smooth animations for step transitions
- Vertical and horizontal layout support

### inlineJavascript.js
Handles initialization and rendering:
- Reads step data from bound business object
- Applies configuration options
- Dynamically generates step items
- Handles status determination
- Manages click events and boundary events

### eventHandler.md
Documents the `change` event handler that updates the stepper when the bound data changes.

### datamodel.md
Documents the business data structure and configuration options in detail.

## Usage Examples

### Basic Configuration

1. **Add the Stepper widget** to your IBM BAW coach view
2. **Bind the business data** to an array variable
3. **Configure the options** as needed

### Example Scenario: Multi-Step Form

```javascript
// Business data: formSteps
tw.local.formSteps = [
  {
    label: "Account Setup",
    description: "Create your account",
    status: "completed"
  },
  {
    label: "Profile Information",
    description: "Tell us about yourself",
    status: "current"
  },
  {
    label: "Preferences",
    description: "Customize your experience",
    status: "pending"
  },
  {
    label: "Verification",
    description: "Verify your email",
    status: "pending"
  }
];

// Configuration:
showNumbers: true
showIcons: true
clickable: false
```

### Example Scenario: Order Tracking

```javascript
// Business data: orderStatus
tw.local.orderStatus = [
  {
    label: "Order Placed",
    description: "December 15, 2024 at 10:30 AM",
    status: "completed"
  },
  {
    label: "Processing",
    description: "Your order is being prepared",
    status: "current"
  },
  {
    label: "Shipped",
    description: "Estimated delivery: Dec 18",
    status: "pending"
  },
  {
    label: "Delivered",
    description: "Package delivered to your address",
    status: "pending"
  }
];

// Configuration:
showNumbers: true
showIcons: true
clickable: false
```

### Example Scenario: Approval Workflow with Errors

```javascript
// Business data: approvalSteps
tw.local.approvalSteps = [
  {
    label: "Submit Request",
    description: "Request submitted",
    status: "completed"
  },
  {
    label: "Manager Review",
    description: "Rejected - missing information",
    status: "error"
  },
  {
    label: "HR Approval",
    status: "disabled"
  },
  {
    label: "Final Approval",
    status: "disabled"
  }
];

// Configuration:
showNumbers: true
showIcons: true
clickable: false
```

### Example Scenario: Interactive Navigation

```javascript
// Business data with click handlers
tw.local.wizardSteps = [
  {
    label: "Step 1",
    description: "First step",
    status: "completed",
    onClick: function(item, index) {
      // Navigate to step 1
      tw.system.navigateTo("Step1View");
    }
  },
  {
    label: "Step 2",
    description: "Second step",
    status: "current"
  },
  {
    label: "Step 3",
    description: "Third step",
    status: "pending"
  }
];

// Configuration:
showNumbers: true
showIcons: true
clickable: true  // Enable click interaction
```

### Example Scenario: Auto-Status with currentStep

```javascript
// Business data (no status specified)
tw.local.processSteps = [
  { label: "Step 1", description: "First step" },
  { label: "Step 2", description: "Second step" },
  { label: "Step 3", description: "Third step" },
  { label: "Step 4", description: "Fourth step" }
];

// Configuration:
currentStep: 2  // Currently on step 3 (0-based index)
// Status will be auto-determined:
// Step 1: completed
// Step 2: completed
// Step 3: current
// Step 4: pending
```

## Technical Details

### CSS Classes

The widget uses the following class structure:

| Class | Purpose |
|-------|---------|
| `stepper_maincontentbox` | Main container |
| `stepper-container` | Inner container |
| `stepper-list` | List of steps |
| `stepper-item` | Individual step item |
| `step-circle` | Circular status indicator |
| `step-label` | Step label text |
| `step-description` | Step description text |
| `completed` | Completed step modifier |
| `current` | Current step modifier |
| `pending` | Pending step modifier |
| `error` | Error step modifier |
| `warning` | Warning step modifier |
| `disabled` | Disabled step modifier |
| `clickable` | Clickable step modifier |
| `vertical` | Vertical layout modifier |

### Responsive Breakpoints

```css
@media (max-width: 672px) {
  /* Mobile adjustments */
  - Smaller circles (28px)
  - Smaller font sizes
  - Reduced spacing
}
```

### Animations

The widget includes smooth animations:
- **Step pulse**: 2-second infinite pulsing animation on current step
- **Hover scale**: 1.1x scale on hover for clickable steps
- **Transition**: 0.3s ease for all state changes

## Color Palette

Following Carbon Design System:

| Element | Color | Hex Code |
|---------|-------|----------|
| Completed circle | Blue 60 | `#0f62fe` |
| Current circle border | Blue 60 | `#0f62fe` |
| Pending circle border | Gray 40 | `#e0e0e0` |
| Error circle | Red 60 | `#da1e28` |
| Warning circle | Yellow 30 | `#f1c21b` |
| Disabled circle | Gray 20 | `#f4f4f4` |
| Completed connector | Blue 60 | `#0f62fe` |
| Pending connector | Gray 40 | `#e0e0e0` |
| Label text | Gray 100 | `#161616` |
| Description text | Gray 70 | `#8d8d8d` |

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
3. **Bind the business data** to an array variable containing step items
4. **Configure the options** (orientation, clickable, etc.)
5. **The widget will automatically update** when the bound data changes

### BAW-Specific Features

- Automatic re-rendering on data change via the `change` event handler
- Support for BAW navigation methods in custom click handlers
- Compatible with BAW's data binding mechanism
- Works with both Coach and Coach View contexts
- Fires `stepClicked` boundary event for integration with coach logic

### Boundary Events

The widget fires a `stepClicked` event when a step is clicked (if `clickable` is enabled):

```javascript
// Event data
{
  step: 2,              // Index of clicked step (0-based)
  item: {               // The step item object
    label: "Step 3",
    status: "pending"
  }
}
```

**To listen to this event:**
1. Add an event handler to your coach
2. Select the Stepper widget as the event source
3. Choose "stepClicked" as the event type
4. Access event data via `event.data.step` and `event.data.item`

## Best Practices

1. **Keep step labels concise**: Use short, descriptive labels (2-3 words)
2. **Use descriptions for details**: Add descriptions for additional context
3. **Maintain consistent status**: Ensure status values are accurate and up-to-date
4. **Consider mobile users**: Test on smaller screens for readability
5. **Use auto-status for simple flows**: Use `currentStep` option for linear processes
6. **Provide clear error messages**: Use error status with descriptive text
7. **Limit number of steps**: Keep to 5-7 steps for optimal UX
8. **Leverage vertical layout**: Ideal for detailed step descriptions and process flows

## Customization

### Theming

The CSS uses Carbon Design System tokens. To customize colors:

```css
.stepper-item.completed .step-circle {
  background-color: #your-brand-color;
  border-color: #your-brand-color;
}

.stepper-item.current .step-circle {
  border-color: #your-brand-color;
}
```

### Custom Icons

To use custom icons instead of the default ones, modify the CSS:

```css
.stepper_icon_completed {
  background-image: url("your-custom-icon.svg");
}
```

## Troubleshooting

### Steps not displaying
- Verify the bound data is an array
- Check that each item has a `label` or `text` property
- Ensure the widget is properly initialized

### Styling issues
- Confirm InlineCSS.css is loaded
- Check for CSS conflicts with other styles
- Verify Carbon Design System classes are not overridden

### Click handlers not working
- Ensure `clickable` option is set to `true`
- Check that steps are not in "disabled" status
- Verify the function is properly defined

### Status not updating
- Create a new array reference when updating data
- Use `tw.local.stepperData = tw.local.stepperData.slice()`
- Check that the change event handler is properly configured

### Animation not smooth
- Ensure browser supports CSS animations
- Check that CSS is properly loaded
- Verify no JavaScript errors in console

## Comparison with Similar Widgets

### Stepper vs Breadcrumb
- **Stepper**: Shows process progression with status indicators
- **Breadcrumb**: Shows navigation hierarchy without status

### Stepper vs ProcessCircle
- **Stepper**: Multi-step linear process with multiple items
- **ProcessCircle**: Single numeric value with circular progress

## License

```
Licensed Materials - Property of IBM
5725-C95
(C) Copyright IBM Corporation
```

---

**Version**: 1.0  
**Last Updated**: 2025  
**IBM BAW Compatibility**: IBM Business Automation Workflow v18.0+  
**Carbon Design System**: v11.x compatible