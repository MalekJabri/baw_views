## Business Data

The widget expects an array of breadcrumb items. Each item should be an object with the following structure:

```javascript
[
  {
    "label": "Home",           // Display text for the breadcrumb item
    "href": "/home",           // URL or route (optional)
    "text": "Home",            // Alternative to label (optional)
    "icon": "home",            // Icon name (optional)
    "status": "completed"      // Completion status (optional)
  },
  {
    "label": "Products",
    "href": "/products",
    "icon": "folder",
    "status": "completed"
  },
  {
    "label": "Electronics",
    "href": "/products/electronics",
    "icon": "folder",
    "status": "in-progress"
  },
  {
    "label": "Laptops",
    "href": "/products/electronics/laptops",
    "icon": "document",
    "status": "pending"
  }
]
```

### Data Structure

- **Type**: Array of Objects
- **Required**: Yes
- **Default**: If no data provided, displays a single "Home" breadcrumb

### Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | String | Yes* | Display text for the breadcrumb item |
| `text` | String | No | Alternative to `label` (used if `label` is not provided) |
| `href` | String | No | URL or route for the breadcrumb link (defaults to "#") |
| `icon` | String | No | Icon name to display (home, folder, document, settings, user, dashboard) |
| `status` | String | No | Completion status: "completed", "in-progress", "pending", or "error" |
| `onClick` | Function | No | Custom click handler function |

*Either `label` or `text` must be provided

### Status Values

| Status | Description | Visual Indicator |
|--------|-------------|------------------|
| `completed` | Step is completed | Blue filled circle with checkmark |
| `in-progress` | Step is currently active | Blue outlined circle with dot (animated pulse on current item) |
| `pending` | Step is not yet started | Gray outlined circle |
| `error` | Step has an error | Red filled circle with exclamation mark |

**Default behavior**: If no status is provided, completed items show "completed" status and the current (last) item shows "in-progress" status.

### Available Icons

- `home` - Home icon
- `folder` - Folder icon
- `document` - Document icon
- `settings` - Settings/gear icon
- `user` - User/profile icon
- `dashboard` - Dashboard icon

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showHomeIcon` | Boolean | `false` | Display a home icon for the first breadcrumb item |
| `showStatusCircles` | Boolean | `true` | Display circular completion status indicators for each item |
| `showIcons` | Boolean | `false` | Display icons for all items (requires `icon` property in data) |
| `maxItems` | Integer | `0` | Maximum number of breadcrumb items to display (0 = no limit). If exceeded, shows first item, ellipsis, and last (maxItems - 2) items |
| `noTrailingSlash` | Boolean | `false` | Remove the trailing slash after the last breadcrumb item |

## Example Data

### Simple Breadcrumb
```javascript
[
  { "label": "Home", "href": "/" },
  { "label": "Dashboard", "href": "/dashboard" }
]
```

### With Icons and Status
```javascript
[
  {
    "label": "Home",
    "href": "/",
    "icon": "home",
    "status": "completed"
  },
  {
    "label": "Dashboard",
    "href": "/dashboard",
    "icon": "dashboard",
    "status": "completed"
  },
  {
    "label": "Settings",
    "href": "/settings",
    "icon": "settings",
    "status": "in-progress"
  }
]
```

### Multi-level Navigation with Status
```javascript
[
  { "label": "Home", "href": "/", "status": "completed" },
  { "label": "Products", "href": "/products", "status": "completed" },
  { "label": "Category", "href": "/products/category", "status": "completed" },
  { "label": "Subcategory", "href": "/products/category/subcategory", "status": "in-progress" },
  { "label": "Item Details", "href": "/products/category/subcategory/item", "status": "pending" }
]
```

### Process Flow with Icons
```javascript
[
  {
    "label": "Start",
    "href": "#",
    "icon": "home",
    "status": "completed"
  },
  {
    "label": "User Info",
    "href": "#",
    "icon": "user",
    "status": "completed"
  },
  {
    "label": "Documents",
    "href": "#",
    "icon": "document",
    "status": "in-progress"
  },
  {
    "label": "Review",
    "href": "#",
    "icon": "settings",
    "status": "pending"
  }
]
```

### With Custom Click Handlers
```javascript
[
  {
    "label": "Home",
    "href": "/",
    "icon": "home",
    "status": "completed",
    "onClick": function(item, index) {
      console.log("Navigating to home");
    }
  },
  {
    "label": "Current Page",
    "href": "/current",
    "status": "in-progress"
  }
]
```

### Error State Example
```javascript
[
  { "label": "Step 1", "href": "#", "status": "completed" },
  { "label": "Step 2", "href": "#", "status": "error" },
  { "label": "Step 3", "href": "#", "status": "pending" }
]