/**
 * Stepper Widget Preview Snippet
 * Renders a stepper widget for preview purposes
 */

function renderStepper(containerId, stepperData, options) {
  options = options || {};
  
  var container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  // Default options
  var showNumbers = options.showNumbers !== false;
  var showIcons = options.showIcons !== false;
  var clickable = options.clickable || false;
  var currentStep = options.currentStep || 0;

  // Create main container
  var mainBox = document.createElement('div');
  mainBox.className = 'stepper_maincontentbox';

  // Create stepper container
  var stepperContainer = document.createElement('div');
  stepperContainer.className = 'stepper-container';

  // Create stepper list
  var stepperList = document.createElement('div');
  stepperList.className = 'stepper-list';

  // Function to create a stepper item
  function createStepperItem(item, index, totalItems) {
    var div = document.createElement("div");
    div.className = "stepper-item";
    
    // Determine step status
    var status = item.status;
    if (!status) {
      // Auto-determine status based on currentStep
      if (index < currentStep) {
        status = "completed";
      } else if (index === currentStep) {
        status = "current";
      } else {
        status = "pending";
      }
    }
    
    // Add status class
    div.classList.add(status);
    
    // Add clickable class if enabled and not disabled
    if (clickable && status !== "disabled") {
      div.classList.add("clickable");
    }
    
    // Create step circle
    var circle = document.createElement("div");
    circle.className = "step-circle";
    
    // Add icon or number to circle
    if (showIcons && status === "completed") {
      var iconDiv = document.createElement("div");
      iconDiv.className = "stepper_icon_completed";
      circle.appendChild(iconDiv);
    } else if (showIcons && status === "error") {
      var iconDiv = document.createElement("div");
      iconDiv.className = "stepper_icon_error";
      circle.appendChild(iconDiv);
    } else if (showIcons && status === "warning") {
      var iconDiv = document.createElement("div");
      iconDiv.className = "stepper_icon_warning";
      circle.appendChild(iconDiv);
    } else if (showNumbers) {
      var numberSpan = document.createElement("span");
      numberSpan.textContent = index + 1;
      circle.appendChild(numberSpan);
    }
    
    div.appendChild(circle);
    
    // Create step content container (for vertical layout)
    var contentDiv = document.createElement("div");
    contentDiv.className = "step-content";
    
    // Create step label
    var label = document.createElement("div");
    label.className = "step-label";
    label.textContent = item.label || item.text || "Step " + (index + 1);
    contentDiv.appendChild(label);
    
    // Create step description if provided
    if (item.description) {
      var description = document.createElement("div");
      description.className = "step-description";
      description.textContent = item.description;
      contentDiv.appendChild(description);
    }
    
    div.appendChild(contentDiv);
    
    // Add click event handler if clickable
    if (clickable && status !== "disabled") {
      div.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Step clicked:", index, item);
        
        // Call custom onClick handler if provided
        if (item.onClick && typeof item.onClick === "function") {
          item.onClick(item, index);
        }
      });
    }
    
    return div;
  }

  // Render stepper items
  if (stepperData && Array.isArray(stepperData) && stepperData.length > 0) {
    stepperData.forEach(function(item, index) {
      var stepperItem = createStepperItem(item, index, stepperData.length);
      stepperList.appendChild(stepperItem);
    });
  } else {
    // If no data, show default steps
    var defaultSteps = [
      { label: "Step 1", status: "completed" },
      { label: "Step 2", status: "current" },
      { label: "Step 3", status: "pending" }
    ];
    
    defaultSteps.forEach(function(item, index) {
      var stepperItem = createStepperItem(item, index, defaultSteps.length);
      stepperList.appendChild(stepperItem);
    });
  }

  // Assemble the widget
  stepperContainer.appendChild(stepperList);
  mainBox.appendChild(stepperContainer);
  container.appendChild(mainBox);
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderStepper: renderStepper };
}

// Made with Bob
