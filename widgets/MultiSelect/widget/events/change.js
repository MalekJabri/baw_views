var container = this.context.element.querySelector(".multiselect-container");
var selectedItemsDiv = container.querySelector(".multiselect-selected-items");
var optionsContainer = container.querySelector(".multiselect-options");

// Get updated selected values
var selectedValues = this.getData() || [];
if (!Array.isArray(selectedValues)) {
  selectedValues = [];
}

// Get configuration
var options = this.getOption("options") || [];
var disabled = this.getOption("disabled");

// Update internal state
var state = {
  selectedValues: selectedValues,
  allOptions: options
};

// Re-render selected items
function renderSelectedItems() {
  // Clear existing tags
  var existingTags = selectedItemsDiv.querySelectorAll(".multiselect-tag");
  for (var i = 0; i < existingTags.length; i++) {
    selectedItemsDiv.removeChild(existingTags[i]);
  }
  
  var placeholderEl = selectedItemsDiv.querySelector(".multiselect-placeholder");
  
  if (state.selectedValues.length === 0) {
    if (placeholderEl) placeholderEl.style.display = "inline";
    return;
  }
  
  if (placeholderEl) placeholderEl.style.display = "none";
  
  state.selectedValues.forEach(function(value) {
    var option = state.allOptions.find(function(opt) {
      return opt.value === value;
    });
    
    if (!option) return;
    
    var tag = document.createElement("div");
    tag.className = "multiselect-tag";
    
    var tagText = document.createElement("span");
    tagText.className = "multiselect-tag-text";
    tagText.textContent = option.name;
    tag.appendChild(tagText);
    
    var removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "multiselect-tag-remove";
    removeBtn.setAttribute("aria-label", "Remove " + option.name);
    removeBtn.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z"/></svg>';
    
    removeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      toggleOption(value);
    });
    
    tag.appendChild(removeBtn);
    selectedItemsDiv.appendChild(tag);
  });
}

// Toggle option selection
function toggleOption(value) {
  if (disabled) return;
  
  var index = state.selectedValues.indexOf(value);
  
  if (index !== -1) {
    state.selectedValues.splice(index, 1);
  } else {
    state.selectedValues.push(value);
  }
  
  this.setData(state.selectedValues);
  renderSelectedItems();
  updateOptions();
}

// Update options display
function updateOptions() {
  var optionElements = optionsContainer.querySelectorAll(".multiselect-option");
  
  optionElements.forEach(function(optionEl) {
    var value = optionEl.getAttribute("data-value");
    var isSelected = state.selectedValues.indexOf(value) !== -1;
    
    if (isSelected) {
      optionEl.classList.add("selected");
      optionEl.setAttribute("aria-selected", "true");
    } else {
      optionEl.classList.remove("selected");
      optionEl.setAttribute("aria-selected", "false");
    }
  });
}

// Execute updates
renderSelectedItems();
updateOptions();

// Update ARIA label
var count = state.selectedValues.length;
var label = count === 0 ? "No items selected" :
            count === 1 ? "1 item selected" :
            count + " items selected";
var inputWrapper = container.querySelector(".multiselect-input-wrapper");
if (inputWrapper) {
  inputWrapper.setAttribute("aria-label", label);
}

// Made with Bob
