# MultiSelect Widget - Data Model

## Business Data

The widget expects an array of selected values and an array of available options.

### Data Structure

#### Selected Values (Bound Data)
- **Type**: Array of Strings
- **Required**: No
- **Default**: `[]` (empty array)
- **Description**: Array of selected option values

#### Options (Configuration)
- **Type**: Array of Objects
- **Required**: Yes
- **Structure**: Each object must have:
  - `value` (String): Unique identifier for the option
  - `label` (String): Display text for the option

### Example Data

```javascript
// Selected values (bound to widget data)
tw.local.selectedItems = ["option1", "option3", "option5"];

// Options configuration (set in widget options)
options: [
  { value: "option1", label: "First Option" },
  { value: "option2", label: "Second Option" },
  { value: "option3", label: "Third Option" },
  { value: "option4", label: "Fourth Option" },
  { value: "option5", label: "Fifth Option" }
]
```

## Configuration Options

The widget supports the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | Array | `[]` | Array of available options (required) |
| `placeholder` | String | `"Select items..."` | Placeholder text when no items selected |
| `maxSelections` | Number | `null` | Maximum number of items that can be selected |
| `showSearch` | Boolean | `true` | Show/hide search input |
| `showActions` | Boolean | `true` | Show/hide Select All/Clear All buttons |
| `disabled` | Boolean | `false` | Disable the entire widget |
| `helperText` | String | `""` | Helper text displayed below the widget |

### Configuration Examples

#### Basic Configuration

```javascript
// In widget configuration options:
{
  options: [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" }
  ]
}
```

#### With Maximum Selections

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

#### Without Search and Actions

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

#### Disabled State

```javascript
{
  options: [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" }
  ],
  disabled: true,
  helperText: "Selection is currently disabled"
}
```

## Data Binding Examples

### Basic Binding

```javascript
// Initialize empty selection
tw.local.selectedCategories = [];

// Bind widget data to this variable
// User selections will automatically update tw.local.selectedCategories
```

### Pre-selected Values

```javascript
// Initialize with pre-selected values
tw.local.selectedTags = ["tag1", "tag3"];

// Widget will display these items as selected on load
```

### Dynamic Options from Service

```javascript
// After calling a service that returns options
tw.local.availableOptions = tw.local.serviceResponse.options;

// Configure widget with:
options: tw.local.availableOptions
```

### From Business Object

```javascript
// Bind to business object property
tw.local.selectedItems = tw.local.order.selectedProducts;

// Options from another property
options: tw.local.order.availableProducts
```

## Option Data Format

### Simple Options

```javascript
[
  { value: "1", label: "Option One" },
  { value: "2", label: "Option Two" },
  { value: "3", label: "Option Three" }
]
```

### Options from Database

```javascript
// Transform database results to option format
var options = [];
for (var i = 0; i < tw.local.dbResults.listLength; i++) {
  options.push({
    value: tw.local.dbResults[i].id.toString(),
    label: tw.local.dbResults[i].name
  });
}

// Use in widget configuration
options: options
```

### Options from Enumeration

```javascript
// Convert BAW enumeration to options
var statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "IN_REVIEW", label: "In Review" }
];

options: statusOptions
```

## Validation

The widget automatically validates and handles:

- **Empty Arrays**: Treated as no selection
- **Invalid Values**: Filtered out (values not in options list)
- **Duplicate Values**: Automatically deduplicated
- **Non-Array Data**: Converted to empty array
- **Max Selections**: Enforced when configured

### Examples

```javascript
// These values are automatically corrected:
null → []
undefined → []
"string" → []
["invalid"] → [] (if "invalid" not in options)
["opt1", "opt1"] → ["opt1"] (deduplicated)
```

## Selection Limits

### Maximum Selections

When `maxSelections` is set:

```javascript
{
  options: [...],
  maxSelections: 3,
  helperText: "Select up to 3 items"
}

// User can only select 3 items
// Attempting to select more shows error message
// Select All button respects this limit
```

### No Limit

```javascript
{
  options: [...],
  maxSelections: null  // or omit this option
}

// User can select all available options
```

## Accessibility

The widget includes full ARIA support:

- `role="combobox"` on input wrapper
- `role="listbox"` on dropdown
- `role="option"` on each option
- `aria-expanded` indicates dropdown state
- `aria-selected` indicates option selection state
- `aria-multiselectable="true"` on listbox
- `aria-label` provides selection count
- `aria-disabled` for disabled state

## Best Practices

1. **Provide Clear Labels**: Use descriptive labels for options
2. **Unique Values**: Ensure all option values are unique
3. **Reasonable Limits**: Set appropriate maxSelections if needed
4. **Helper Text**: Use helper text to guide users
5. **Validate Input**: Ensure options array is properly formatted
6. **Handle Empty State**: Provide meaningful placeholder text
7. **Consider Performance**: For large option lists (>100), consider pagination

## Integration Examples

### Example 1: Category Selection

```javascript
// Initialize
tw.local.selectedCategories = [];
tw.local.categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "home", label: "Home & Garden" }
];

// Widget configuration
{
  options: tw.local.categoryOptions,
  placeholder: "Select categories...",
  helperText: "Choose one or more categories"
}
```

### Example 2: Team Member Selection

```javascript
// Load team members from service
tw.local.teamMembers = [
  { value: "user1", label: "John Doe" },
  { value: "user2", label: "Jane Smith" },
  { value: "user3", label: "Bob Johnson" }
];

tw.local.selectedMembers = [];

// Widget configuration
{
  options: tw.local.teamMembers,
  maxSelections: 5,
  placeholder: "Select team members...",
  helperText: "Select up to 5 team members"
}
```

### Example 3: Tag Selection

```javascript
// Pre-selected tags
tw.local.selectedTags = ["urgent", "review"];

tw.local.availableTags = [
  { value: "urgent", label: "Urgent" },
  { value: "review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" }
];

// Widget configuration
{
  options: tw.local.availableTags,
  placeholder: "Add tags...",
  showSearch: true,
  showActions: true
}
```

### Example 4: Skills Selection

```javascript
// Skills from database
function loadSkills() {
  // After service call
  var skills = [];
  for (var i = 0; i < tw.local.skillsData.listLength; i++) {
    skills.push({
      value: tw.local.skillsData[i].skillId,
      label: tw.local.skillsData[i].skillName
    });
  }
  return skills;
}

tw.local.selectedSkills = tw.local.employee.skills || [];
tw.local.skillOptions = loadSkills();

// Widget configuration
{
  options: tw.local.skillOptions,
  placeholder: "Select skills...",
  maxSelections: 10,
  helperText: "Select relevant skills (max 10)"
}
```

## Troubleshooting

### Options Not Displaying

**Problem**: Dropdown is empty or shows "No results found"

**Solutions**:
1. Verify options array is properly formatted
2. Check that each option has both `value` and `label` properties
3. Ensure options is set in widget configuration, not bound data
4. Check browser console for JavaScript errors

### Selected Values Not Persisting

**Problem**: Selections are lost on page refresh or navigation

**Solutions**:
1. Ensure selected values are bound to a persistent variable
2. Check that the variable is part of the process data model
3. Verify the variable is not being reset elsewhere
4. Use tw.local for temporary data, tw.system for persistent data

### Max Selections Not Working

**Problem**: Users can select more than the limit

**Solutions**:
1. Verify maxSelections is set as a number, not a string
2. Check that the option is in the configuration, not bound data
3. Ensure the value is greater than 0
4. Test with a fresh page load

### Search Not Working

**Problem**: Search input doesn't filter options

**Solutions**:
1. Verify showSearch is set to true
2. Check that options have searchable labels
3. Clear browser cache and reload
4. Check for JavaScript errors in console

## Related Documentation

- [Event Handler Configuration](./eventHandler.md)
- [Widget README](../README.md)