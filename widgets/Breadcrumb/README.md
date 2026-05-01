# Breadcrumb Widget

An IBM Business Automation Workflow (BAW) custom view widget that displays navigation breadcrumbs using Carbon Design System styling and layout principles.

## Overview

The Breadcrumb widget provides a clear navigation path for users in IBM BAW applications. It features:

- **Carbon Design System styling** with authentic IBM design language
- **Dynamic breadcrumb generation** from array data
- **Configurable display options** (max items, trailing slash, etc.)
- **Responsive design** that adapts to different screen sizes
- **Accessibility support** with ARIA attributes
- **Custom click handlers** for flexible navigation logic
- **Overflow handling** with ellipsis for long breadcrumb trails

## Visual Representation

The widget displays as a horizontal breadcrumb navigation:

```
Home / Products / Electronics / Laptops
  ↑       ↑           ↑            ↑
Link    Link        Link      Current Page
```

### Carbon Design System Features

- **Typography**: IBM Plex Sans font family with proper sizing
- **Colors**: IBM Carbon color palette (Blue 60 for links, Gray 100 for current)
- **Spacing**: Consistent 0.5rem spacing between items
- **Separators**: Forward slash (/) separators between items
- **Hover states**: Underline on hover with color transition
- **Focus states**: 2px blue outline for keyboard navigation

## Configuration Options

The widget accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showHomeIcon` | Boolean | `false` | Display a home icon for the first breadcrumb item |
| `maxItems` | Integer | `0` | Maximum number of items to display (0 = no limit). Shows first item, ellipsis, and last (maxItems - 2) items when exceeded |
| `noTrailingSlash` | Boolean | `false` | Remove the trailing slash after the last breadcrumb item |

## Business Data

### Input Data

- **Type**: Array of Objects
- **Description**: An array of breadcrumb items representing the navigation path
- **Structure**: Each item contains:
  - `label` or `text`: Display text for the breadcrumb
  - `href`: URL or route (optional, defaults to "#")
  - `onClick`: Custom click handler function (optional)

### Example Data Structure

```javascript
[
  {
    "label": "Home",
    "href": "/"
  },
  {
    "label": "Products",
    "href": "/products"
  },
  {
    "label": "Electronics",
    "href": "/products/electronics"
  },
  {
    "label": "Laptops",
    "href": "/products/electronics/laptops"
  }
]
```

## File Structure

```
Breadcrumb/
├── README.md                          # This file
├── widget/                            # Widget implementation files
│   ├── Layout.html                    # HTML structure with Carbon classes
│   ├── InlineCSS.css                  # Carbon Design System styling
│   ├── inlineJavascript.js            # Initialization and rendering logic
│   ├── datamodel.md                   # Data model documentation
│   └── eventHandler.md                # Event handler documentation
└── AdvancePreview/                    # Preview mode implementation
    ├── Breadcrumb.html                # Preview styles
    └── BreadcrumbSnippet.js           # Preview generation logic
```

## Component Files

### Layout.html
Defines the HTML structure using Carbon Design System classes:
```html
<nav name="BreadcrumbNav" class="cds--breadcrumb" aria-label="Breadcrumb navigation">
  <ol class="cds--breadcrumb-list">
    <!-- Breadcrumb items dynamically generated -->
  </ol>
</nav>
```

### InlineCSS.css
Contains Carbon Design System styling:
- Typography and spacing following IBM design guidelines
- Link states (default, hover, focus, active, visited)
- Responsive breakpoints for mobile devices
- Accessibility enhancements
- Separator styling

### inlineJavascript.js
Handles initialization and rendering:
- Reads breadcrumb data from bound business object
- Applies configuration options
- Dynamically generates breadcrumb items
- Handles overflow with ellipsis
- Marks current page with appropriate ARIA attributes

### eventHandler.md
Documents the `change` event handler that updates the breadcrumb when the bound data changes.

### datamodel.md
Documents the business data structure and configuration options in detail.

## Usage Examples

### Basic Configuration

1. **Add the Breadcrumb widget** to your IBM BAW coach view
2. **Bind the business data** to an array variable
3. **Configure the options** as needed

### Example Scenario: E-commerce Navigation

```javascript
// Business data: breadcrumbPath
tw.local.breadcrumbPath = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Electronics", href: "/products/electronics" },
  { label: "Laptops", href: "/products/electronics/laptops" }
];

// Configuration:
maxItems: 0 (show all)
noTrailingSlash: false
showHomeIcon: false

// Result: Home / Products / Electronics / Laptops
```

### Example Scenario: Document Management

```javascript
// Business data: documentPath
tw.local.documentPath = [
  { label: "Documents", href: "/docs" },
  { label: "Projects", href: "/docs/projects" },
  { label: "2024", href: "/docs/projects/2024" },
  { label: "Q4", href: "/docs/projects/2024/q4" },
  { label: "Report.pdf", href: "/docs/projects/2024/q4/report.pdf" }
];

// Configuration:
maxItems: 4 (limit display)
noTrailingSlash: true

// Result: Documents / ... / 2024 / Q4 / Report.pdf
```

### Example Scenario: Custom Navigation

```javascript
// Business data with custom click handlers
tw.local.breadcrumbPath = [
  { 
    label: "Dashboard", 
    href: "/dashboard",
    onClick: function(item, index) {
      // Custom navigation logic
      tw.system.navigateTo("DashboardView");
    }
  },
  { 
    label: "Tasks", 
    href: "/tasks",
    onClick: function(item, index) {
      tw.system.navigateTo("TaskListView");
    }
  },
  { 
    label: "Task Details", 
    href: "/tasks/123"
  }
];
```

## Technical Details

### Carbon Design System Classes

The widget uses official Carbon Design System class names:

| Class | Purpose |
|-------|---------|
| `cds--breadcrumb` | Main breadcrumb container |
| `cds--breadcrumb-list` | Ordered list of breadcrumb items |
| `cds--breadcrumb-item` | Individual breadcrumb item |
| `cds--breadcrumb-item--current` | Current page indicator |
| `cds--link` | Link styling |
| `cds--breadcrumb--no-trailing-slash` | Modifier to remove trailing slash |

### Responsive Breakpoints

```css
@media (max-width: 672px) {
  /* Mobile adjustments */
  - Smaller font size (0.75rem)
  - Reduced spacing (0.25rem)
}
```

### Accessibility Features

The widget implements ARIA attributes for screen reader support:
- `aria-label="Breadcrumb navigation"`: Identifies the navigation purpose
- `aria-current="page"`: Marks the current page in the breadcrumb trail
- Semantic HTML with `<nav>` and `<ol>` elements
- Keyboard navigation support with focus states

## Overflow Handling

When `maxItems` is configured and the breadcrumb trail exceeds the limit:

```
Before: Home / Level1 / Level2 / Level3 / Level4 / Level5 / Current
After (maxItems=4): Home / ... / Level4 / Level5 / Current
```

The algorithm:
1. Always shows the first item (typically "Home")
2. Adds an ellipsis item ("...")
3. Shows the last (maxItems - 2) items
4. Ensures the current page is always visible

## Color Palette

Following Carbon Design System:

| Element | Color | Hex Code |
|---------|-------|----------|
| Link (default) | Blue 60 | `#0f62fe` |
| Link (hover) | Blue 70 | `#0043ce` |
| Link (visited) | Purple 60 | `#8a3ffc` |
| Current page | Gray 100 | `#161616` |
| Separator | Gray 70 | `#525252` |

## Browser Compatibility

The widget uses modern web standards:
- CSS Flexbox for layout
- CSS Custom Properties (if needed for theming)
- ES5+ JavaScript

**Recommended browsers**: Chrome 85+, Firefox 90+, Safari 14+, Edge 85+

## Integration with IBM BAW

This widget is designed to be used as a custom Coach View in IBM Business Automation Workflow. To integrate:

1. **Import the widget** into your Process App or Toolkit
2. **Add it to a Coach or Coach View**
3. **Bind the business data** to an array variable containing breadcrumb items
4. **Configure the options** (maxItems, noTrailingSlash, etc.)
5. **The widget will automatically update** when the bound data changes

### BAW-Specific Features

- Automatic re-rendering on data change via the `change` event handler
- Support for BAW navigation methods in custom click handlers
- Compatible with BAW's data binding mechanism
- Works with both Coach and Coach View contexts

## Best Practices

1. **Keep breadcrumb trails concise**: Use maxItems to limit very long paths
2. **Use meaningful labels**: Make each breadcrumb item descriptive
3. **Maintain consistency**: Use the same breadcrumb structure across your application
4. **Consider mobile users**: Test on smaller screens to ensure readability
5. **Provide clear navigation**: Ensure each breadcrumb link leads to a valid page

## Customization

### Theming

The CSS uses Carbon Design System tokens. To customize colors:

```css
.cds--link {
  color: #your-brand-color;
}

.cds--link:hover {
  color: #your-hover-color;
}
```

### Custom Separators

To change the separator from "/" to another character:

```css
.cds--breadcrumb-item::after {
  content: '›'; /* or '>', '→', etc. */
}
```

## Troubleshooting

### Breadcrumbs not displaying
- Verify the bound data is an array
- Check that each item has a `label` or `text` property
- Ensure the widget is properly initialized

### Styling issues
- Confirm InlineCSS.css is loaded
- Check for CSS conflicts with other styles
- Verify Carbon Design System classes are not overridden

### Click handlers not working
- Ensure `onClick` is a valid function
- Check browser console for JavaScript errors
- Verify the function is properly bound to the item

## License

```
Licensed Materials - Property of IBM
5725-C95
(C) Copyright IBM Corporation
```

---

**Version**: 1.0  
**Last Updated**: 2025  
**IBM BAW Compatibility**: IBM Business Automation Workflow v18.0+  
**Carbon Design System**: v11.x compatible