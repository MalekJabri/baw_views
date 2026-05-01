// Get the stepper container elements
var stepperContainer = this.context.element.querySelector(".stepper_maincontentbox");
var stepperList = stepperContainer.querySelector(".stepper-list");

// Get the stepper data (array of step items)
var stepperData = this.getData().items;

// Get configuration options
var showNumbers = this.getOption("showNumbers") !== false; // Default true
var showIcons = this.getOption("showIcons") !== false; // Default true
var clickable = this.getOption("clickable") || false; // Default false
var currentStep = this.getOption("currentStep") || 0; // Default 0 (first step)

// Clear existing stepper items
stepperList.innerHTML = "";

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

// Made with Bob
