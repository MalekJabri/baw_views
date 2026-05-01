
  // Store widget context reference
  var widget = this;

  
  var container = widget.context.element.querySelector(".multiselect-container");
  var wrapper = container.querySelector(".multiselect-wrapper");
  var inputWrapper = container.querySelector(".multiselect-input-wrapper");
  var selectedItemsDiv = container.querySelector(".multiselect-selected-items");
  var toggleBtn = container.querySelector(".multiselect-toggle");
  var dropdown = container.querySelector(".multiselect-dropdown");
  var searchInput = container.querySelector(".multiselect-search");
  var optionsContainer = container.querySelector(".multiselect-options");
  var selectAllBtn = container.querySelector(".multiselect-select-all");
  var clearAllBtn = container.querySelector(".multiselect-clear-all");
  var helperText = container.querySelector(".multiselect-helper-text");
  
  // Get configuration options
  var options = widget.getOption("options").items;;
  var placeholder = widget.getOption("placeholder") || "Select items...";
  var maxSelections = widget.getOption("maxSelections") || null;
  var showSearch = widget.getOption("showSearch");
  var showActions = widget.getOption("showActions");
  var disabled = widget.getOption("disabled");
  var helperTextValue = widget.getOption("helperText") || "";
  
  // Validate and ensure options is an array
  if (!options || !Array.isArray(options)) {
    options = [];
  }
  
  // Set default values
  if (showSearch === undefined || showSearch === null) showSearch = true;
  if (showActions === undefined || showActions === null) showActions = true;
  if (disabled === undefined || disabled === null) disabled = false;
  
  // Get selected values from bound data
  var selectedValues = widget.getData() || [];
  if (!Array.isArray(selectedValues)) {
    selectedValues = [];
  }
  
  // State management
  var state = {
    isOpen: false,
    selectedValues: selectedValues,
    filteredOptions: options.slice(), // Create a copy
    allOptions: options.slice() // Create a copy
  };
  
  // Initialize widget
  function init() {
    // Set placeholder
    var placeholderEl = selectedItemsDiv.querySelector(".multiselect-placeholder");
    if (placeholderEl) {
      placeholderEl.textContent = placeholder;
    }
    
    // Set helper text
    if (helperTextValue) {
      helperText.textContent = helperTextValue;
    }
    
    // Hide/show search
    if (!showSearch) {
      var searchWrapper = container.querySelector(".multiselect-search-wrapper");
      if (searchWrapper) searchWrapper.style.display = "none";
    }
    
    // Hide/show actions
    if (!showActions) {
      var actionsDiv = container.querySelector(".multiselect-actions");
      if (actionsDiv) actionsDiv.style.display = "none";
    }
    
    // Set disabled state
    if (disabled) {
      container.classList.add("disabled");
      inputWrapper.setAttribute("aria-disabled", "true");
    }
    
    // Render options and selected items
    renderOptions();
    renderSelectedItems();
    updateActionButtons();
    
    // Attach event listeners
    attachEventListeners();
  }
  
  // Render options in dropdown
  function renderOptions() {
    optionsContainer.innerHTML = "";
    
    if (state.filteredOptions.length === 0) {
      var noResults = document.createElement("div");
      noResults.className = "multiselect-no-results";
      noResults.textContent = "No results found";
      optionsContainer.appendChild(noResults);
      return;
    }
    
    state.filteredOptions.forEach(function(option) {
      var optionEl = document.createElement("div");
      optionEl.className = "multiselect-option";
      optionEl.setAttribute("role", "option");
      optionEl.setAttribute("data-value", option.value);
      optionEl.setAttribute("tabindex", "0");
      
      var isSelected = state.selectedValues.indexOf(option.value) !== -1;
      if (isSelected) {
        optionEl.classList.add("selected");
        optionEl.setAttribute("aria-selected", "true");
      } else {
        optionEl.setAttribute("aria-selected", "false");
      }
      
      // Checkbox
      var checkbox = document.createElement("div");
      checkbox.className = "multiselect-checkbox";
      checkbox.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 11.7L3.3 8.5l.7-.7 2.5 2.5 5.2-5.2.7.7z"/></svg>';
      optionEl.appendChild(checkbox);
      
      // Text
      var text = document.createElement("span");
      text.className = "multiselect-option-text";
      text.textContent = option.name;
      optionEl.appendChild(text);
      
      // Click handler
      optionEl.addEventListener("click", function() {
        toggleOption(option.value);
      });
      
      // Keyboard handler
      optionEl.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleOption(option.value);
        }
      });
      
      optionsContainer.appendChild(optionEl);
    });
  }
  
  // Render selected items as tags
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
      // Deselect
      state.selectedValues.splice(index, 1);
    } else {
      // Select
      if (maxSelections && state.selectedValues.length >= maxSelections) {
        showError("Maximum " + maxSelections + " items can be selected");
        return;
      }
      state.selectedValues.push(value);
    }
    
    // Update data binding
    widget.setData(state.selectedValues);
    
    // Re-render
    renderOptions();
    renderSelectedItems();
    updateActionButtons();
    updateAriaLabel();
  }
  
  // Toggle dropdown
  function toggleDropdown() {
    if (disabled) return;
    
    state.isOpen = !state.isOpen;
    
    if (state.isOpen) {
      dropdown.classList.add("open");
      inputWrapper.classList.add("active");
      inputWrapper.setAttribute("aria-expanded", "true");
      if (showSearch) searchInput.focus();
    } else {
      dropdown.classList.remove("open");
      inputWrapper.classList.remove("active");
      inputWrapper.setAttribute("aria-expanded", "false");
      searchInput.value = "";
      state.filteredOptions = state.allOptions;
      renderOptions();
    }
  }
  
  // Filter options based on search
  function filterOptions(searchTerm) {
    var term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      state.filteredOptions = state.allOptions;
    } else {
      state.filteredOptions = state.allOptions.filter(function(option) {
        return option.name.toLowerCase().indexOf(term) !== -1 ||
               option.value.toLowerCase().indexOf(term) !== -1;
      });
    }
    
    renderOptions();
  }
  
  // Select all options
  function selectAll() {
    if (disabled) return;
    
    if (maxSelections) {
      state.selectedValues = state.allOptions.slice(0, maxSelections).map(function(opt) {
        return opt.value;
      });
      if (state.allOptions.length > maxSelections) {
        showError("Only first " + maxSelections + " items selected (limit reached)");
      }
    } else {
      state.selectedValues = state.allOptions.map(function(opt) {
        return opt.value;
      });
    }
    
    widget.setData(state.selectedValues);
    renderOptions();
    renderSelectedItems();
    updateActionButtons();
    updateAriaLabel();
  }
  
  // Clear all selections
  function clearAll() {
    if (disabled) return;
    
    state.selectedValues = [];
    widget.setData(state.selectedValues);
    renderOptions();
    renderSelectedItems();
    updateActionButtons();
    updateAriaLabel();
  }
  
  // Update action buttons state
  function updateActionButtons() {
    if (!showActions) return;
    
    if (state.selectedValues.length === 0) {
      clearAllBtn.disabled = true;
    } else {
      clearAllBtn.disabled = false;
    }
    
    if (maxSelections && state.selectedValues.length >= maxSelections) {
      selectAllBtn.disabled = true;
    } else if (state.selectedValues.length === state.allOptions.length) {
      selectAllBtn.disabled = true;
    } else {
      selectAllBtn.disabled = false;
    }
  }
  
  // Update ARIA label
  function updateAriaLabel() {
    var count = state.selectedValues.length;
    var label = count === 0 ? "No items selected" :
                count === 1 ? "1 item selected" :
                count + " items selected";
    inputWrapper.setAttribute("aria-label", label);
  }
  
  // Show error message
  function showError(message) {
    container.classList.add("error");
    helperText.textContent = message;
    helperText.classList.add("error");
    
    setTimeout(function() {
      container.classList.remove("error");
      helperText.textContent = helperTextValue;
      helperText.classList.remove("error");
    }, 3000);
  }
  
  // Attach event listeners
  function attachEventListeners() {
    // Toggle dropdown
    inputWrapper.addEventListener("click", toggleDropdown);
    toggleBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      toggleDropdown();
    });
    
    // Search input
    if (showSearch) {
      searchInput.addEventListener("input", function(e) {
        filterOptions(e.target.value);
      });
      
      searchInput.addEventListener("click", function(e) {
        e.stopPropagation();
      });
    }
    
    // Action buttons
    if (showActions) {
      selectAllBtn.addEventListener("click", selectAll);
      clearAllBtn.addEventListener("click", clearAll);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
      if (!container.contains(e.target) && state.isOpen) {
        toggleDropdown();
      }
    });
    
    // Keyboard navigation
    inputWrapper.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleDropdown();
      } else if (e.key === "Escape" && state.isOpen) {
        toggleDropdown();
      }
    });
  }
  
  // Initialize the widget
  init();
  updateAriaLabel();
// Made with Bob