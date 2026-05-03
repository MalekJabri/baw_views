# ProgressBar Widget Event Handlers

## Available Events

### progressChanged
Executed when the progress value changes, either through data binding updates or programmatic updates.

**Event Parameters:**
- `value`: Object containing progress information
  - `value.value`: Current progress value (0-100)
  - `value.state`: Current color state ("state-low", "state-moderate", or "state-high")
  - `value.status`: Current status message

**Event Registration:**
```javascript
this.registerEventHandlingFunction(this, "progressChanged", "value");
```

**Example Event Handler:**
```javascript
// Access the event data
var progressValue = value.value;        // e.g., 75
var progressState = value.state;        // e.g., "state-high"
var statusMessage = value.status;       // e.g., "Complete"

console.log("Progress updated to:", progressValue + "%");
console.log("Current state:", progressState);
console.log("Status:", statusMessage);

// Perform actions based on progress
if (progressValue === 100) {
  // Progress complete - enable submit button
  this.ui.get("submitButton").setEnabled(true);
  this.ui.get("submitButton").setLabel("Submit");
} else if (progressValue >= 75) {
  // High progress - show success message
  this.ui.get("messageText").setText("Almost done!");
} else if (progressValue >= 50) {
  // Moderate progress - show encouragement
  this.ui.get("messageText").setText("You're halfway there!");
} else if (progressValue > 0) {
  // Low progress - show initial message
  this.ui.get("messageText").setText("Keep going!");
}

// Update other widgets based on state
if (progressState === "state-high") {
  // Green state - show success indicator
  this.ui.get("statusIcon").setVisible(true);
  this.ui.get("statusIcon").setIcon("checkmark");
} else if (progressState === "state-moderate") {
  // Yellow state - show warning indicator
  this.ui.get("statusIcon").setVisible(true);
  this.ui.get("statusIcon").setIcon("warning");
} else {
  // Red state - show info indicator
  this.ui.get("statusIcon").setVisible(true);
  this.ui.get("statusIcon").setIcon("info");
}
```

### change
Executed when the widget's bound data changes through BAW's data binding mechanism.

**Example Change Handler:**
```javascript
// Get the updated progress data
var progressData = this.getData();

// Extract progress value
var progressValue = 0;
if (typeof progressData === "number") {
  progressValue = progressData;
} else if (progressData && progressData.value !== undefined) {
  progressValue = progressData.value;
} else if (progressData && progressData.percentage !== undefined) {
  progressValue = progressData.percentage;
}

console.log("Data changed - new progress:", progressValue);

// The widget automatically updates its display
// Additional custom logic can be added here
```

## Event Usage Examples

### Example 1: Multi-Step Form Progress
```javascript
// progressChanged event handler
var currentProgress = value.value;

// Update step indicator
var totalSteps = 5;
var currentStep = Math.ceil((currentProgress / 100) * totalSteps);
this.ui.get("stepIndicator").setText("Step " + currentStep + " of " + totalSteps);

// Enable/disable navigation buttons
if (currentProgress === 100) {
  this.ui.get("nextButton").setLabel("Finish");
  this.ui.get("nextButton").setEnabled(true);
} else if (currentProgress > 0) {
  this.ui.get("nextButton").setLabel("Next");
  this.ui.get("nextButton").setEnabled(true);
  this.ui.get("backButton").setEnabled(true);
} else {
  this.ui.get("nextButton").setEnabled(false);
  this.ui.get("backButton").setEnabled(false);
}
```

### Example 2: File Upload Progress
```javascript
// progressChanged event handler
var uploadProgress = value.value;

// Update upload status
if (uploadProgress === 0) {
  this.ui.get("uploadStatus").setText("Ready to upload");
  this.ui.get("uploadButton").setEnabled(true);
  this.ui.get("cancelButton").setEnabled(false);
} else if (uploadProgress < 100) {
  this.ui.get("uploadStatus").setText("Uploading... " + uploadProgress + "%");
  this.ui.get("uploadButton").setEnabled(false);
  this.ui.get("cancelButton").setEnabled(true);
} else {
  this.ui.get("uploadStatus").setText("Upload complete!");
  this.ui.get("uploadButton").setEnabled(false);
  this.ui.get("cancelButton").setEnabled(false);
  this.ui.get("viewFileButton").setEnabled(true);
}
```

### Example 3: Task Completion Tracking
```javascript
// progressChanged event handler
var taskProgress = value.value;
var completedTasks = Math.floor((taskProgress / 100) * tw.local.totalTasks);

// Update task counter
this.ui.get("taskCounter").setText(
  completedTasks + " of " + tw.local.totalTasks + " tasks completed"
);

// Show completion message
if (taskProgress === 100) {
  this.ui.get("completionMessage").setVisible(true);
  this.ui.get("completionMessage").setText("All tasks completed! Great job!");
  
  // Trigger completion workflow
  tw.local.allTasksComplete = true;
}
```

### Example 4: Approval Workflow Progress
```javascript
// progressChanged event handler
var approvalProgress = value.value;

// Update approval stage
if (approvalProgress < 25) {
  tw.local.currentStage = "Submitted";
  this.ui.get("stageLabel").setText("Stage: Submitted");
} else if (approvalProgress < 50) {
  tw.local.currentStage = "Manager Review";
  this.ui.get("stageLabel").setText("Stage: Manager Review");
} else if (approvalProgress < 75) {
  tw.local.currentStage = "HR Review";
  this.ui.get("stageLabel").setText("Stage: HR Review");
} else if (approvalProgress < 100) {
  tw.local.currentStage = "Final Approval";
  this.ui.get("stageLabel").setText("Stage: Final Approval");
} else {
  tw.local.currentStage = "Approved";
  this.ui.get("stageLabel").setText("Stage: Approved");
  
  // Enable final actions
  this.ui.get("downloadButton").setEnabled(true);
  this.ui.get("notifyButton").setEnabled(true);
}
```

### Example 5: Dynamic Status Updates
```javascript
// progressChanged event handler
var progress = value.value;
var state = value.state;

// Update custom status message based on progress
var customStatus = "";
if (progress === 0) {
  customStatus = "Waiting to start...";
} else if (progress < 25) {
  customStatus = "Initializing process...";
} else if (progress < 50) {
  customStatus = "Processing data...";
} else if (progress < 75) {
  customStatus = "Validating results...";
} else if (progress < 100) {
  customStatus = "Finalizing...";
} else {
  customStatus = "Process complete!";
}

// Update the progress data with custom status
tw.local.progressData.status = customStatus;

// Log progress for audit trail
console.log("Progress update:", {
  timestamp: new Date().toISOString(),
  progress: progress,
  state: state,
  status: customStatus
});
```

## Programmatic Progress Updates

You can update progress programmatically from other widgets or scripts:

```javascript
// Get the progress bar widget
var progressBar = this.ui.get("myProgressBar");

// Update progress (this will trigger the progressChanged event)
progressBar.updateProgress(50);

// Or update the bound data directly
tw.local.progressValue = 75;  // This will trigger the change event
```

## Notes

- The `progressChanged` event fires whenever progress updates, including:
  - Data binding changes
  - Programmatic updates via `updateProgress()`
  - Initial widget load
- The event provides complete progress information (value, state, status)
- Use the event to coordinate with other widgets and workflow logic
- The widget automatically handles visual updates; event handlers are for additional logic
- Event handlers have access to all BAW context (tw.local, tw.system, etc.)