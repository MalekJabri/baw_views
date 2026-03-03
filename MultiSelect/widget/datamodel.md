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
  - `name` (String): Display text for the option

### Example Data

```javascript
// Selected values (bound to widget data)
tw.local.selectedItems = ["option1", "option3", "option5"];

// Options configuration (set in widget options)
options: [
  { value: "option1", name: "First Option" },
  { value: "option2", name: "Second Option" },
  { value: "option3", name: "Third Option" },
  { value: "option4", name: "Fourth Option" },
  { value: "option5", name: "Fifth Option" }
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
    { value: "apple", name: "Apple" },
    { value: "banana", name: "Banana" },
    { value: "orange", name: "Orange" }
  ]
}
```

#### With Maximum Selections

```javascript
{
  options: [
    { value: "red", name: "Red" },
    { value: "blue", name: "Blue" },
    { value: "green", name: "Green" },
    { value: "yellow", name: "Yellow" }
  ],
  maxSelections: 2,
  helperText: "Select up to 2 colors"
}
```

#### Without Search and Actions

```javascript
{
  options: [
    { value: "small", name: "Small" },
    { value: "medium", name: "Medium" },
    { value: "large", name: "Large" }
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
    { value: "opt1", name: "Option 1" },
    { value: "opt2", name: "Option 2" }
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
  { value: "1", name: "Option One" },
  { value: "2", name: "Option Two" },
  { value: "3", name: "Option Three" }
]
```

### Options from Database

```javascript
// Transform database results to option format
var options = [];
for (var i = 0; i < tw.local.dbResults.listLength; i++) {
  options.push({
    value: tw.local.dbResults[i].id.toString(),
    name: tw.local.dbResults[i].name
  });
}

// Use in widget configuration
options: options
```

### Options from Enumeration

```javascript
// Convert BAW enumeration to options
var statusOptions = [
  { value: "PENDING", name: "Pending" },
  { value: "APPROVED", name: "Approved" },
  { value: "REJECTED", name: "Rejected" },
  { value: "IN_REVIEW", name: "In Review" }
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

1. **Provide Clear Names**: Use descriptive names for options
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
  { value: "electronics", name: "Electronics" },
  { value: "clothing", name: "Clothing" },
  { value: "books", name: "Books" },
  { value: "home", name: "Home & Garden" }
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
  { value: "user1", name: "John Doe" },
  { value: "user2", name: "Jane Smith" },
  { value: "user3", name: "Bob Johnson" }
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
  { value: "urgent", name: "Urgent" },
  { value: "review", name: "Needs Review" },
  { value: "approved", name: "Approved" },
  { value: "pending", name: "Pending" }
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
2. Check that each option has both `value` and `name` properties
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
2. Check that options have searchable names
3. Clear browser cache and reload
4. Check for JavaScript errors in console

## Related Documentation

- [Event Handler Configuration](./eventHandler.md)
- [Widget README](../README.md)