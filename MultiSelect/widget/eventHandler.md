# MultiSelect Widget - Event Handler

## Change Event Handler

The `change` event handler is triggered whenever the selected values change. This ensures the widget updates in real-time when the bound data changes externally.

### Configuration Steps

1. In IBM BAW Process Designer, open your custom view
2. Go to the **Behavior** tab
3. Add a **change** event handler
4. Copy and paste the code below into the event handler

### Event Handler Code

```javascript
// Get widget elements
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
    tagText.textContent = option.label;
    tag.appendChild(tagText);
    
    var removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "multiselect-tag-remove";
    removeBtn.setAttribute("aria-label", "Remove " + option.label);
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
}.bind(this);

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
```

## Event Handler Explanation

### What It Does

1. **Retrieves Current Values**: Gets the latest selected values from bound data
2. **Validates Input**: Ensures data is a valid array
3. **Updates Visual Elements**:
   - Re-renders selected item tags
   - Updates option checkboxes
   - Updates placeholder visibility
4. **Maintains Sync**: Keeps widget display in sync with data changes
5. **Updates Accessibility**: Updates ARIA attributes for screen readers

### When It Triggers

The change event handler is automatically triggered when:

- The bound data variable changes value
- External script modifies the selected values
- A service call updates the selection
- User interaction in another widget affects the bound data
- Process flow updates the variable

### Configuration Options Handling

The event handler respects these configuration options:

- `options`: Available options list
- `disabled`: Prevents interaction when true

## Usage Examples

### Example 1: External Selection Update

```javascript
// In your coach view script
tw.local.selectedItems = ["item1", "item3"];
// Change event fires automatically, widget updates
```

### Example 2: Add Selection Programmatically

```javascript
// Add a new selection
tw.local.selectedCategories.push("newCategory");
// Widget updates to show the new tag
```

### Example 3: Clear All Selections

```javascript
// Clear all selections
tw.local.selectedTags = [];
// Widget shows placeholder again
```

### Example 4: Replace Selections

```javascript
// Replace entire selection
tw.local.selectedMembers = ["user1", "user2", "user3"];
// Widget updates to show new selection
```

### Example 5: Service Response Update

```javascript
// After calling a service
tw.local.selectedItems = tw.local.serviceResponse.selectedIds;
// Widget automatically reflects the new selection
```

## Testing the Event Handler

### Test Scenario 1: Initial Load with Pre-selected Values

1. Set initial value: `tw.local.selected = ["opt1", "opt2"]`
2. Expected: Two tags displayed, options checked

### Test Scenario 2: Add Selection Externally

1. Current: `tw.local.selected = ["opt1"]`
2. Update: `tw.local.selected.push("opt2")`
3. Expected: Second tag appears, option checked

### Test Scenario 3: Remove Selection Externally

1. Current: `tw.local.selected = ["opt1", "opt2"]`
2. Update: `tw.local.selected = ["opt1"]`
3. Expected: Second tag removed, option unchecked

### Test Scenario 4: Clear All

1. Current: `tw.local.selected = ["opt1", "opt2", "opt3"]`
2. Update: `tw.local.selected = []`
3. Expected: All tags removed, placeholder shown

### Test Scenario 5: Invalid Values

1. Update: `tw.local.selected = ["invalid", "opt1"]`
2. Expected: Only valid option shown, invalid filtered out

### Test Scenario 6: Non-Array Data

1. Update: `tw.local.selected = "string"`
2. Expected: Treated as empty array, placeholder shown

## Troubleshooting

### Event Handler Not Firing

**Problem**: Widget doesn't update when data changes

**Solutions**:
1. Verify the change event handler is configured in the Behavior tab
2. Check that the code is copied correctly without syntax errors
3. Ensure the bound variable is actually changing
4. Check browser console for JavaScript errors
5. Verify the variable is properly bound to the widget

### Tags Not Updating

**Problem**: Selected items don't display correctly

**Solutions**:
1. Verify options array contains the selected values
2. Check that option values match selected values exactly
3. Ensure options have both `value` and `label` properties
4. Clear browser cache and reload

### Options Not Checking/Unchecking

**Problem**: Checkboxes don't reflect selection state

**Solutions**:
1. Verify the change event handler is properly configured
2. Check that option elements have `data-value` attributes
3. Ensure selected values are strings matching option values
4. Test with simple string values first

### Performance Issues

**Problem**: Slow updates with many selections

**Solutions**:
1. Limit the number of options (consider pagination for >100 items)
2. Optimize the rendering logic if needed
3. Use debouncing for rapid updates
4. Check for memory leaks in event listeners

### Placeholder Not Showing

**Problem**: Placeholder doesn't appear when empty

**Solutions**:
1. Verify selected values array is truly empty
2. Check that placeholder element exists in DOM
3. Ensure CSS display property is not overridden
4. Test with a fresh page load

## Best Practices

1. **Always Configure**: Add the change event handler during widget setup
2. **Test Thoroughly**: Test with various data scenarios
3. **Validate Data**: Ensure bound data is always an array
4. **Monitor Performance**: Watch for performance issues with large datasets
5. **Use Console Logging**: Add temporary console.log for debugging
6. **Handle Edge Cases**: Test with empty arrays, invalid values, etc.
7. **Keep It Simple**: Don't add complex logic to the event handler

## Advanced Usage

### Conditional Updates

```javascript
// Only update if certain conditions are met
if (tw.local.selectedItems.listLength > 0) {
  // Process selections
  tw.local.processedItems = tw.local.selectedItems;
}
```

### Validation on Change

```javascript
// Validate selections
if (tw.local.selectedCategories.listLength < 2) {
  tw.local.validationError = "Please select at least 2 categories";
} else {
  tw.local.validationError = "";
}
```

### Trigger Other Actions

```javascript
// Trigger other actions when selection changes
if (tw.local.selectedMembers.listLength >= 3) {
  // Enable submit button
  tw.local.canSubmit = true;
} else {
  tw.local.canSubmit = false;
}
```

### Sync with Other Widgets

```javascript
// Update related widget based on selection
tw.local.selectedCount = tw.local.selectedItems.listLength;
tw.local.selectionSummary = tw.local.selectedItems.listLength + " items selected";
```

## Integration with BAW Events

### On Load Event

```javascript
// Initialize selections on coach load
tw.local.selectedItems = tw.local.savedSelections || [];
```

### Before Submit

```javascript
// Validate before form submission
if (tw.local.selectedCategories.listLength === 0) {
  alert("Please select at least one category");
  return false;
}
```

### On Button Click

```javascript
// Process selections on button click
function processSelections() {
  if (tw.local.selectedItems.listLength > 0) {
    // Call service with selections
    tw.local.serviceInput.selectedIds = tw.local.selectedItems;
  }
}
```

## Related Documentation

- [Data Model Documentation](./datamodel.md)
- [Widget README](../README.md)