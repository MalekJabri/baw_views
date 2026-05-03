// ProgressBar Widget - BAW Implementation

// Get the progress data from BAW binding
var progressData = this.getData();

// Get configuration options
var showPercentage = this.getOption("showPercentage") !== false; // Default true
var showStatus = this.getOption("showStatus") !== false; // Default true
var animated = this.getOption("animated") !== false; // Default true
var customMessages = this.getOption("customMessages") || null;

// Register event handling for progress updates
this.registerEventHandlingFunction(this, "progressChanged", "value");

// Get DOM elements
var container = this.context.element.querySelector(".progressbar_maincontentbox");
var track = container.querySelector(".progressbar-track");
var fill = container.querySelector(".progressbar-fill");
var percentageElement = container.querySelector(".percentage-value");
var statusElement = container.querySelector(".status-message");

// Extract progress value (0-100)
var progressValue = 0;
if (progressData) {
  if (typeof progressData === "number") {
    progressValue = progressData;
  } else if (progressData.value !== undefined) {
    progressValue = progressData.value;
  } else if (progressData.percentage !== undefined) {
    progressValue = progressData.percentage;
  }
}

// Ensure progress is within valid range
progressValue = Math.max(0, Math.min(100, progressValue));

// Function to determine color state based on progress
function getColorState(value) {
  if (value < 50) {
    return "state-low"; // Red
  } else if (value < 75) {
    return "state-moderate"; // Yellow
  } else {
    return "state-high"; // Green
  }
}

// Function to get status message
function getStatusMessage(value) {
  // Use custom messages if provided
  if (customMessages) {
    if (value === 0 && customMessages.notStarted) {
      return customMessages.notStarted;
    } else if (value > 0 && value < 100 && customMessages.inProgress) {
      return customMessages.inProgress;
    } else if (value === 100 && customMessages.complete) {
      return customMessages.complete;
    }
  }
  
  // Default messages
  if (value === 0) {
    return "Not started";
  } else if (value < 100) {
    return "In progress...";
  } else {
    return "Complete";
  }
}

// Function to get status state class
function getStatusState(value) {
  if (value === 0) {
    return "state-not-started";
  } else if (value < 100) {
    return "state-in-progress";
  } else {
    return "state-complete";
  }
}

// Update progress bar
function updateProgress(value) {
  var colorState = getColorState(value);
  var statusMessage = getStatusMessage(value);
  var statusState = getStatusState(value);
  
  // Update progress bar fill
  fill.style.width = value + "%";
  
  // Remove all state classes
  fill.classList.remove("state-low", "state-moderate", "state-high");
  percentageElement.classList.remove("state-low", "state-moderate", "state-high");
  statusElement.classList.remove("state-not-started", "state-in-progress", "state-complete");
  
  // Add current state class
  fill.classList.add(colorState);
  percentageElement.classList.add(colorState);
  statusElement.classList.add(statusState);
  
  // Update percentage display
  if (showPercentage) {
    percentageElement.textContent = Math.round(value) + "%";
    percentageElement.parentElement.style.display = "flex";
  } else {
    percentageElement.parentElement.style.display = "none";
  }
  
  // Update status message
  if (showStatus) {
    statusElement.textContent = statusMessage;
    statusElement.parentElement.style.display = "flex";
  } else {
    statusElement.parentElement.style.display = "none";
  }
  
  // Update ARIA attributes
  track.setAttribute("aria-valuenow", Math.round(value));
  track.setAttribute("aria-valuetext", Math.round(value) + "% - " + statusMessage);
  
  // Disable animation if configured
  if (!animated) {
    fill.style.transition = "none";
  }
}

// Initial render
updateProgress(progressValue);

// Store reference to widget instance for event handling
var me = this;

// Listen for data changes (BAW automatic updates)
if (this.context && this.context.binding) {
  var binding = this.context.binding;
  
  // Watch for changes to the bound data
  if (binding.addDataChangeListener) {
    binding.addDataChangeListener(function(newValue) {
      var newProgress = 0;
      
      if (typeof newValue === "number") {
        newProgress = newValue;
      } else if (newValue && newValue.value !== undefined) {
        newProgress = newValue.value;
      } else if (newValue && newValue.percentage !== undefined) {
        newProgress = newValue.percentage;
      }
      
      newProgress = Math.max(0, Math.min(100, newProgress));
      updateProgress(newProgress);
      
      // Fire boundary event for progress change
      if (me.ui && me.ui.fireEvent) {
        me.ui.fireEvent("progressChanged", {
          value: newProgress,
          state: getColorState(newProgress),
          status: getStatusMessage(newProgress)
        });
      }
    });
  }
}

// Public method to manually update progress (for programmatic control)
this.updateProgress = function(newValue) {
  var value = Math.max(0, Math.min(100, newValue));
  updateProgress(value);
  
  // Update the bound data if possible
  if (this.context && this.context.binding && this.context.binding.set) {
    if (typeof progressData === "number") {
      this.context.binding.set(value);
    } else if (progressData && typeof progressData === "object") {
      progressData.value = value;
      this.context.binding.set(progressData);
    }
  }
  
  // Fire boundary event
  if (this.ui && this.ui.fireEvent) {
    this.ui.fireEvent("progressChanged", {
      value: value,
      state: getColorState(value),
      status: getStatusMessage(value)
    });
  }
};

// Made with Bob