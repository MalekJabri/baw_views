## Business Data

The widget expects an array of step items. Each item should be an object with the following structure:

```javascript
[
  {
    "label": "Personal Information",    // Display text for the step
    "description": "Enter your details", // Optional description
    "status": "completed",               // Step status (optional)
    "onClick": function(item, index) {}  // Custom click handler (optional)
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

### Data Structure

- **Type**: Array of Objects
- **Required**: Yes
- **Default**: If no data provided, displays three default steps

### Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | String | Yes* | Display text for the step |
| `text` | String | No | Alternative to `label` (used if `label` is not provided) |
| `description` | String | No | Additional description text shown below the label |
| `status` | String | No | Step status: "completed", "current", "pending", "error", "warning", or "disabled" |
| `onClick` | Function | No | Custom click handler function (only works if `clickable` option is enabled) |

*Either `label` or `text` must be provided

### Status Values

| Status | Description | Visual Indicator |
|--------|-------------|------------------|
| `completed` | Step is completed | Blue filled circle with checkmark icon |
| `current` | Step is currently active | Blue outlined circle with pulsing animation |
| `pending` | Step is not yet started | Gray outlined circle with step number |
| `error` | Step has an error | Red filled circle with error icon |
| `warning` | Step has a warning | Yellow filled circle with warning icon |
| `disabled` | Step is disabled | Gray filled circle, not clickable |

**Default behavior**: If no status is provided, the widget automatically determines status based on the `currentStep` configuration option:
- Steps before `currentStep`: "completed"
- Step at `currentStep`: "current"
- Steps after `currentStep`: "pending"

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showNumbers` | Boolean | `true` | Display step numbers in circles (hidden when status icons are shown) |
| `showIcons` | Boolean | `true` | Display status icons (checkmark for completed, error/warning icons) |
| `clickable` | Boolean | `false` | Enable click interaction on steps (disabled steps are never clickable) |
| `currentStep` | Integer | `0` | Index of the current step (0-based). Used for auto-determining status |

## Example Data

### Simple Linear Process
```javascript
[
  { "label": "Start", "status": "completed" },
  { "label": "In Progress", "status": "current" },
  { "label": "Complete", "status": "pending" }
]
```

### Multi-Step Form with Descriptions
```javascript
[
  {
    "label": "Account Setup",
    "description": "Create your account",
    "status": "completed"
  },
  {
    "label": "Profile Information",
    "description": "Tell us about yourself",
    "status": "completed"
  },
  {
    "label": "Preferences",
    "description": "Customize your experience",
    "status": "current"
  },
  {
    "label": "Verification",
    "description": "Verify your email",
    "status": "pending"
  }
]
```

### Process with Error State
```javascript
[
  { "label": "Data Entry", "status": "completed" },
  { "label": "Validation", "status": "error", "description": "Please fix errors" },
  { "label": "Submission", "status": "disabled" }
]
```

### Approval Workflow
```javascript
[
  {
    "label": "Submit Request",
    "description": "Request submitted on 12/15/2024",
    "status": "completed"
  },
  {
    "label": "Manager Review",
    "description": "Pending approval",
    "status": "current"
  },
  {
    "label": "HR Approval",
    "description": "Awaiting HR review",
    "status": "pending"
  },
  {
    "label": "Final Approval",
    "description": "Executive sign-off",
    "status": "pending"
  }
]
```

### With Custom Click Handlers
```javascript
[
  {
    "label": "Step 1",
    "description": "First step",
    "status": "completed",
    "onClick": function(item, index) {
      console.log("Navigating to step", index);
      // Custom navigation logic
    }
  },
  {
    "label": "Step 2",
    "description": "Second step",
    "status": "current"
  },
  {
    "label": "Step 3",
    "description": "Third step",
    "status": "pending"
  }
]
```

### Using currentStep for Auto-Status
```javascript
// Configuration: currentStep = 2

// Data (status will be auto-determined):
[
  { "label": "Step 1" },  // Will be "completed"
  { "label": "Step 2" },  // Will be "completed"
  { "label": "Step 3" },  // Will be "current"
  { "label": "Step 4" },  // Will be "pending"
  { "label": "Step 5" }   // Will be "pending"
]
```

### Order Tracking Example
```javascript
[
  {
    "label": "Order Placed",
    "description": "December 15, 2024 at 10:30 AM",
    "status": "completed"
  },
  {
    "label": "Processing",
    "description": "Your order is being prepared",
    "status": "current"
  },
  {
    "label": "Shipped",
    "description": "Estimated delivery: Dec 18",
    "status": "pending"
  },
  {
    "label": "Delivered",
    "description": "Package delivered to your address",
    "status": "pending"
  }
]
```

## Events

### stepClicked Event

The widget registers a `stepClicked` boundary event that fires when a step is clicked (only when `clickable` option is enabled).

**Event Registration:**
```javascript
this.registerEventHandlingFunction(this, "stepClicked", "index");
```

**Event Data:**
The event passes the clicked step index (0-based) as the parameter.

**Event Handler Example:**
```javascript
// In your BAW coach event handler for stepClicked
// The 'index' parameter contains the clicked step index
console.log("Step clicked:", index);

// Access the step data
var stepData = this.getData()[index];
console.log("Step label:", stepData.label);
console.log("Step status:", stepData.status);

// Navigate to the clicked step
this.setOption("currentStep", index);
```

**Firing the Event:**
The widget automatically fires this event when a step is clicked:
```javascript
me.ui.fireEvent("stepClicked", {
  step: index,
  item: item
});
```

**Usage in BAW:**
1. Add the Stepper widget to your coach
2. Enable the `clickable` option
3. Add an event handler for `stepClicked` in the Events tab
4. Use the `index` parameter to handle step navigation

## Notes

- The widget displays steps in a vertical layout
- The widget automatically handles vertical connector lines between steps
- Completed steps show a blue connector line
- Pending steps show a gray connector line
- The current step has a pulsing animation to draw attention
- Responsive design adjusts for mobile devices (smaller circles and text)