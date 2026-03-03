# MultiSelect Widget

A modern, feature-rich multi-select dropdown widget for IBM Business Automation Workflow (BAW) with search functionality, tag display, and full keyboard accessibility.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Data Binding](#data-binding)
- [Examples](#examples)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## 🎯 Overview

The MultiSelect widget provides an intuitive way to select multiple items from a dropdown list in IBM BAW applications. It features real-time search, visual tag display, and comprehensive keyboard navigation.

### Key Highlights

- **Multi-Selection**: Select multiple items with checkboxes
- **Search Functionality**: Real-time filtering of options
- **Tag Display**: Selected items shown as removable tags
- **Bulk Actions**: Select All and Clear All buttons
- **Keyboard Navigation**: Full keyboard accessibility
- **Carbon Design**: Follows IBM Carbon Design System guidelines
- **Customizable**: Extensive configuration options
- **Responsive**: Works on desktop and mobile devices

## ✨ Features

### Visual Features

- **Dropdown Interface**: Clean, modern dropdown with smooth animations
- **Selected Tags**: Visual tags for each selected item with remove buttons
- **Search Input**: Filter options as you type
- **Checkboxes**: Clear visual indication of selected items
- **Action Buttons**: Quick Select All and Clear All functionality
- **Helper Text**: Optional helper text for guidance

### Functional Features

- **Multiple Selection**: Select as many items as needed
- **Selection Limits**: Optional maximum selection limit
- **Real-time Search**: Instant filtering of options
- **Bulk Operations**: Select or clear all items at once
- **Tag Removal**: Click X on any tag to deselect
- **Keyboard Support**: Full keyboard navigation and selection
- **Disabled State**: Disable widget when needed

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | Array | `[]` | Array of available options (required) |
| `placeholder` | String | `"Select items..."` | Placeholder text |
| `maxSelections` | Number | `null` | Maximum selections allowed |
| `showSearch` | Boolean | `true` | Show/hide search input |
| `showActions` | Boolean | `true` | Show/hide action buttons |
| `disabled` | Boolean | `false` | Disable the widget |
| `helperText` | String | `""` | Helper text below widget |

## 🚀 Installation

### Prerequisites

- IBM Business Automation Workflow v18.0+
- Process Designer access
- Modern browser (Chrome 85+, Firefox 90+, Safari 14+, Edge 85+)

### Installation Steps

1. **Open Process Designer**
   - Navigate to your Process App or Toolkit
   - Go to **User Interface** → **Views**

2. **Create Custom HTML View**
   - Click **New** → **Custom HTML**
   - Name it "MultiSelect"

3. **Copy Widget Files**

   **a. HTML Layout**
   - Open the **HTML** tab
   - Copy content from `widget/Layout.html`
   - Paste into the HTML tab

   **b. Inline CSS**
   - Open the **Inline CSS** tab
   - Copy content from `widget/InlineCSS.css`
   - Paste into the Inline CSS tab

   **c. Inline JavaScript**
   - Open the **Inline JavaScript** tab
   - Copy content from `widget/inlineJavascript.js`
   - Paste into the Inline JavaScript tab

4. **Configure Event Handler**
   - Go to the **Behavior** tab
   - Add a **change** event handler
   - Copy code from `widget/eventHandler.md`
   - Paste into the event handler

5. **Configure Data Model**
   - In the **Variables** section, add a binding variable
   - Type: List of String (or String[])
   - Name: `selectedItems` (or your preferred name)

6. **Configure Options**
   - In the **Configuration** section, add options
   - Set the `options` array with your available choices

7. **Save and Test**
   - Save the custom view
   - Add it to a coach for testing

## 🎬 Quick Start

### Basic Usage

1. **Add Widget to Coach**
   ```
   Drag the "MultiSelect" widget onto your coach view
   ```

2. **Create Business Data**
   ```javascript
   // In your BAW coach view
   tw.local.selectedCategories = [];
   ```

3. **Configure Options**
   ```javascript
   // In widget configuration
   options: [
     { value: "cat1", label: "Category 1" },
     { value: "cat2", label: "Category 2" },
     { value: "cat3", label: "Category 3" }
   ]
   ```

4. **Bind Data**
   ```
   Bind the widget's data property to tw.local.selectedCategories
   ```

5. **Use Selections**
   ```javascript
   // Access selected values
   var selected = tw.local.selectedCategories;
   // Result: ["cat1", "cat3"] (example)
   ```

### Example: Category Selector

```javascript
// Initialize
tw.local.selectedCategories = [];

// Configure widget options
options: [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" }
]

// After user selects items
// tw.local.selectedCategories = ["electronics", "books", "sports"]
```

## ⚙️ Configuration

### Basic Configuration

```javascript
{
  options: [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
    { value: "opt3", label: "Option 3" }
  ],
  placeholder: "Select items...",
  helperText: "Choose one or more options"
}
```

### With Maximum Selections

```javascript
{
  options: [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" }
  ],
  maxSelections: 2,
  helperText: "Select up to 2 colors"
}
```

### Minimal Configuration (No Search/Actions)

```javascript
{
  options: [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ],
  showSearch: false,
  showActions: false,
  placeholder: "Choose size..."
}
```

### Disabled State

```javascript
{
  options: [...],
  disabled: true,
  helperText: "Selection is currently disabled"
}
```

## 📊 Data Binding

### Simple Binding

```javascript
// Initialize empty selection
tw.local.selectedItems = [];

// Widget automatically updates this array as user selects/deselects
```

### Pre-selected Values

```javascript
// Initialize with pre-selected values
tw.local.selectedTags = ["tag1", "tag3", "tag5"];

// Widget displays these as selected on load
```

### Dynamic Options

```javascript
// Load options from service
function loadOptions() {
  // After service call
  var opts = [];
  for (var i = 0; i < tw.local.serviceData.listLength; i++) {
    opts.push({
      value: tw.local.serviceData[i].id,
      label: tw.local.serviceData[i].name
    });
  }
  return opts;
}

tw.local.availableOptions = loadOptions();

// Configure widget
options: tw.local.availableOptions
```

### From Business Object

```javascript
// Bind to business object properties
tw.local.selectedItems = tw.local.order.selectedProducts;

// Options from another property
options: tw.local.order.availableProducts
```

## 📚 Examples

### Example 1: Team Member Selection

```javascript
// Initialize
tw.local.selectedMembers = [];
tw.local.teamMembers = [
  { value: "user1", label: "John Doe" },
  { value: "user2", label: "Jane Smith" },
  { value: "user3", label: "Bob Johnson" },
  { value: "user4", label: "Alice Williams" }
];

// Widget configuration
{
  options: tw.local.teamMembers,
  placeholder: "Select team members...",
  maxSelections: 5,
  helperText: "Select up to 5 team members for this project"
}

// After selection
// tw.local.selectedMembers = ["user1", "user3", "user4"]
```

### Example 2: Skills Selection

```javascript
// Initialize
tw.local.selectedSkills = tw.local.employee.skills || [];
tw.local.availableSkills = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "sql", label: "SQL" },
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" }
];

// Widget configuration
{
  options: tw.local.availableSkills,
  placeholder: "Select your skills...",
  maxSelections: 10,
  showSearch: true,
  showActions: true,
  helperText: "Select all relevant skills"
}
```

### Example 3: Tag Management

```javascript
// Initialize with existing tags
tw.local.selectedTags = ["urgent", "review"];
tw.local.availableTags = [
  { value: "urgent", label: "🔴 Urgent" },
  { value: "review", label: "👀 Needs Review" },
  { value: "approved", label: "✅ Approved" },
  { value: "pending", label: "⏳ Pending" },
  { value: "blocked", label: "🚫 Blocked" }
];

// Widget configuration
{
  options: tw.local.availableTags,
  placeholder: "Add tags...",
  showSearch: true,
  showActions: true,
  helperText: "Tag this item for better organization"
}
```

### Example 4: Department Selection

```javascript
// Load departments from database
tw.local.selectedDepartments = [];
tw.local.departments = [
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "Information Technology" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" }
];

// Widget configuration
{
  options: tw.local.departments,
  placeholder: "Select departments...",
  maxSelections: 3,
  helperText: "Select up to 3 departments for notification"
}
```

### Example 5: Product Categories

```javascript
// E-commerce category selection
tw.local.selectedCategories = [];
tw.local.productCategories = [
  { value: "electronics", label: "Electronics & Computers" },
  { value: "clothing", label: "Clothing & Accessories" },
  { value: "books", label: "Books & Media" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "toys", label: "Toys & Games" },
  { value: "food", label: "Food & Beverages" },
  { value: "health", label: "Health & Beauty" }
];

// Widget configuration
{
  options: tw.local.productCategories,
  placeholder: "Filter by categories...",
  showSearch: true,
  showActions: true,
  helperText: "Select categories to filter products"
}
```

## ♿ Accessibility

### ARIA Support

The widget includes comprehensive ARIA attributes:

```html
<div role="combobox" 
     aria-expanded="false" 
     aria-haspopup="listbox"
     aria-label="No items selected">
  
<div role="listbox" 
     aria-multiselectable="true">
  
<div role="option" 
     aria-selected="false"
     tabindex="0">
```

### Keyboard Navigation

- **Tab**: Navigate to/from widget
- **Enter/Space**: Open dropdown or toggle option
- **Escape**: Close dropdown
- **Arrow Keys**: Navigate through options
- **Type**: Search/filter options

### Screen Reader Support

- Selection count announced
- Option states announced
- Actions clearly labeled
- Helper text read aloud

### Best Practices

1. **Provide Labels**: Add descriptive labels above the widget
2. **Use Helper Text**: Guide users with clear instructions
3. **Test with Screen Readers**: Verify announcements are helpful
4. **Keyboard Only**: Ensure all functions work without mouse
5. **Color Independence**: Don't rely solely on color for information

## 🔧 Troubleshooting

### Widget Not Displaying

**Problem**: Widget appears blank or broken

**Solutions**:
1. Verify all three files (HTML, CSS, JS) are copied correctly
2. Check browser console for JavaScript errors
3. Ensure options array is properly configured
4. Clear browser cache and reload

### Options Not Showing

**Problem**: Dropdown is empty

**Solutions**:
1. Verify options array is set in configuration (not bound data)
2. Check that each option has both `value` and `label` properties
3. Ensure options is an array of objects
4. Check for JavaScript errors in console

### Search Not Working

**Problem**: Search doesn't filter options

**Solutions**:
1. Verify `showSearch` is set to `true`
2. Check that options have searchable labels
3. Clear browser cache
4. Test with simple option labels first

### Selections Not Persisting

**Problem**: Selected values are lost

**Solutions**:
1. Ensure bound variable is part of process data model
2. Check that variable is not being reset elsewhere
3. Verify change event handler is configured
4. Use appropriate variable scope (tw.local vs tw.system)

### Max Selections Not Working

**Problem**: Can select more than limit

**Solutions**:
1. Verify `maxSelections` is a number, not a string
2. Check that option is in configuration
3. Ensure value is greater than 0
4. Test with a fresh page load

### Tags Not Displaying

**Problem**: Selected items don't show as tags

**Solutions**:
1. Verify selected values match option values exactly
2. Check that options array contains the selected values
3. Ensure CSS is loaded correctly
4. Inspect element in browser developer tools

## 📖 API Reference

### Data Binding

```javascript
this.getData()  // Returns: Array of Strings (selected values)
this.setData(array)  // Sets: Array of Strings
```

### Configuration Options

```javascript
this.getOption("options")        // Returns: Array of Objects
this.getOption("placeholder")    // Returns: String
this.getOption("maxSelections")  // Returns: Number or null
this.getOption("showSearch")     // Returns: Boolean
this.getOption("showActions")    // Returns: Boolean
this.getOption("disabled")       // Returns: Boolean
this.getOption("helperText")     // Returns: String
```

### Option Object Structure

```javascript
{
  value: "unique-id",    // String (required)
  label: "Display Text"  // String (required)
}
```

### DOM Elements

```javascript
// Container
.multiselect-container

// Input wrapper (clickable area)
.multiselect-input-wrapper

// Selected items display
.multiselect-selected-items

// Individual tag
.multiselect-tag

// Dropdown
.multiselect-dropdown

// Search input
.multiselect-search

// Options container
.multiselect-options

// Individual option
.multiselect-option

// Action buttons
.multiselect-select-all
.multiselect-clear-all
```

### CSS Classes

```javascript
// State classes
.active          // Dropdown is open
.selected        // Option is selected
.disabled        // Widget is disabled
.error           // Error state
.hidden          // Element is hidden
.open            // Dropdown is visible
```

## 📄 Documentation Files

- **[datamodel.md](./widget/datamodel.md)** - Detailed data structure and configuration
- **[eventHandler.md](./widget/eventHandler.md)** - Event handler setup and code
- **[Layout.html](./widget/Layout.html)** - HTML structure
- **[InlineCSS.css](./widget/InlineCSS.css)** - Complete styling
- **[inlineJavascript.js](./widget/inlineJavascript.js)** - Widget logic

## 🎯 Best Practices

1. **Clear Labels**: Use descriptive option labels
2. **Unique Values**: Ensure all option values are unique
3. **Reasonable Limits**: Set appropriate maxSelections
4. **Helper Text**: Guide users with clear instructions
5. **Validate Input**: Ensure options array is properly formatted
6. **Test Thoroughly**: Test with various data scenarios
7. **Consider Performance**: For large lists (>100), consider pagination
8. **Accessibility First**: Always test with keyboard and screen readers

## 🔄 Version History

- **v1.0.0** (March 2026) - Initial release
  - Multi-select dropdown with checkboxes
  - Real-time search functionality
  - Tag display for selected items
  - Select All and Clear All actions
  - Maximum selection limit
  - Full keyboard accessibility
  - Carbon Design System styling

## 📞 Support

For issues or questions:
- Review the [Troubleshooting](#troubleshooting) section
- Check [datamodel.md](./widget/datamodel.md) for data structure details
- See [eventHandler.md](./widget/eventHandler.md) for event configuration
- Consult [IBM BAW Documentation](https://www.ibm.com/docs/en/baw)

## 📄 License

```
Licensed Materials - Property of IBM
5725-C95
(C) Copyright IBM Corporation 2025-2026
```

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Compatibility**: IBM Business Automation Workflow v18.0+  
**Carbon Design System**: v11.x compatible

---

**Made with Bob** 🤖