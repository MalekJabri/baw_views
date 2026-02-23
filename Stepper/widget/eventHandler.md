# Event Handler Documentation

## Change Event Handler

The Stepper widget includes a `change` event handler that automatically updates the stepper display when the bound business data changes.

### Purpose

This event handler ensures that the stepper widget stays synchronized with the underlying business data. When the data changes (e.g., when a step is completed or the current step advances), the widget automatically re-renders to reflect the new state.

### Implementation

```javascript
// Get the stepper container elements
var stepperContainer = this.context.element.querySelector(".stepper_maincontentbox");
var stepperList = stepperContainer.querySelector(".stepper-list");

// Get the updated stepper data
var stepperData = this.getData();

// Get configuration options
var showNumbers = this.getOption("showNumbers") !== false;
var showIcons = this.getOption("showIcons") !== false;
var clickable = this.getOption("clickable") || false;
var currentStep = this.getOption("currentStep") || 0;

// Clear existing stepper items
stepperList.innerHTML = "";

// Re-render stepper items with updated data
// (Same rendering logic as in inlineJavascript.js)
```

### When It Triggers

The change event handler is triggered automatically by IBM BAW when:

1. **Data binding changes**: The bound business object array is modified
2. **Step progression**: A step's status is updated (e.g., from "current" to "completed")
3. **Configuration changes**: Options like `currentStep` are updated
4. **Data refresh**: The entire data array is replaced with new values

### Usage Examples

#### Example 1: Advancing to Next Step

```javascript
// In your BAW coach script
// Current step data
tw.local.stepperData = [
  { label: "Step 1", status: "completed" },
  { label: "Step 2", status: "current" },
  { label: "Step 3", status: "pending" }
];

// User completes Step 2, advance to Step 3
tw.local.stepperData = [
  { label: "Step 1", status: "completed" },
  { label: "Step 2", status: "completed" },
  { label: "Step 3", status: "current" }
];

// The change event handler automatically updates the display
```

#### Example 2: Updating Step Status

```javascript
// Mark a step as having an error
tw.local.stepperData[1].status = "error";
tw.local.stepperData[1].description = "Validation failed";

// Trigger change event
tw.local.stepperData = tw.local.stepperData.slice(); // Create new array reference
```

#### Example 3: Using currentStep Configuration

```javascript
// Instead of manually setting status, use currentStep
// Configuration: currentStep = 2

// Just update the data labels/descriptions
tw.local.stepperData = [
  { label: "Step 1", description: "Completed" },
  { label: "Step 2", description: "Completed" },
  { label: "Step 3", description: "In progress" },
  { label: "Step 4", description: "Pending" }
];

// Status is auto-determined based on currentStep
```

#### Example 4: Dynamic Step Addition

```javascript
// Add a new step dynamically
tw.local.stepperData.push({
  label: "New Step",
  description: "Additional step added",
  status: "pending"
});

// Trigger change event
tw.local.stepperData = tw.local.stepperData.slice();
```

### Best Practices

1. **Immutable Updates**: When modifying step data, create a new array reference to ensure the change event fires:
   ```javascript
   // Good - creates new reference
   tw.local.stepperData = tw.local.stepperData.slice();
   
   // Also good - using spread operator
   tw.local.stepperData = [...tw.local.stepperData];
   ```

2. **Batch Updates**: If updating multiple steps, make all changes then trigger once:
   ```javascript
   // Update multiple steps
   tw.local.stepperData[0].status = "completed";
   tw.local.stepperData[1].status = "completed";
   tw.local.stepperData[2].status = "current";
   
   // Trigger change event once
   tw.local.stepperData = tw.local.stepperData.slice();
   ```

3. **Preserve Data Structure**: Ensure all required properties are maintained:
   ```javascript
   // Good - maintains structure
   tw.local.stepperData[0] = {
     label: "Updated Step",
     description: "New description",
     status: "completed"
   };
   
   // Bad - missing required properties
   tw.local.stepperData[0] = { status: "completed" };
   ```

4. **Use currentStep for Simple Progression**: For linear workflows, use the `currentStep` configuration option instead of manually managing status:
   ```javascript
   // Simpler approach
   this.setOption("currentStep", 2); // Automatically updates all step statuses
   ```

### Boundary Events

The widget can fire custom boundary events that you can listen to in your BAW coach:

#### stepClicked Event

Fired when a step is clicked (only if `clickable` option is enabled):

```javascript
// Event data structure
{
  step: 2,              // Index of clicked step (0-based)
  item: {               // The step item object
    label: "Step 3",
    status: "pending",
    description: "..."
  }
}
```

**Listening to the event in BAW:**

1. Add an event handler to your coach
2. Select the Stepper widget as the event source
3. Choose "stepClicked" as the event type
4. Access event data via `event.data.step` and `event.data.item`

### Performance Considerations

- The change event handler clears and re-renders all steps
- For large numbers of steps (>20), consider pagination or virtual scrolling
- Avoid frequent updates (e.g., every second) as it may impact performance
- Use debouncing for rapid successive updates

### Troubleshooting

**Issue**: Stepper not updating after data change
- **Solution**: Ensure you're creating a new array reference, not just modifying the existing one

**Issue**: Steps showing incorrect status
- **Solution**: Check that `currentStep` configuration matches your data, or explicitly set status on each step

**Issue**: Click events not working
- **Solution**: Verify `clickable` option is set to `true` and steps are not in "disabled" status

**Issue**: Animation not smooth
- **Solution**: Ensure CSS is properly loaded and browser supports CSS animations

### Related Files

- `inlineJavascript.js` - Contains the initial rendering logic (same as change handler)
- `datamodel.md` - Documents the expected data structure
- `InlineCSS.css` - Defines the visual styling and animations