## change

This event handler is triggered when the bound breadcrumb data changes. It re-renders the breadcrumb navigation with the updated data.

```js
// Get the breadcrumb container elements
var breadcrumbContainer = this.context.element.querySelector(".breadcrumb_maincontentbox");
var breadcrumbList = breadcrumbContainer.querySelector(".breadcrumb-list");

// Get the updated breadcrumb data
var breadcrumbData = this.getData();

// Get configuration options
var showNumbering = this.getOption("showNumbering") !== false; // Default true
var maxItems = this.getOption("maxItems") || 0; // 0 means no limit

// Clear existing breadcrumb items
breadcrumbList.innerHTML = "";

// Function to create a breadcrumb item
function createBreadcrumbItem(item, index, isLast, totalItems) {
  var div = document.createElement("div");
  div.className = "breadcrumb-item";
  
  // Add status class if provided
  var status = item.status;
  if (!status) {
    // Auto-determine status based on position
    if (index < totalItems - 1) {
      status = "completed";
    } else if (isLast) {
      status = "working";
    } else {
      status = "notyetstarted";
    }
  }
  
  // Add status class to the div for CSS styling (enables status-based border colors)
  div.classList.add(status);
  
  if (isLast) {
    div.classList.add("current");
  }
  
  var link = document.createElement("a");
  link.className = "breadcrumb-link";
  link.href = item.href || "#";
  
  // Add status icon - directly use status value with breadcrumb_ prefix
  var iconDiv = document.createElement("div");
  iconDiv.className = "breadcrumb_" + status;
  link.appendChild(iconDiv);
  
  // Add text with optional numbering
  var textSpan = document.createElement("span");
  var labelText = item.label || item.text || "";
  if (showNumbering) {
    labelText = (index + 1) + ". " + labelText;
  }
  textSpan.textContent = labelText;
  link.appendChild(textSpan);
  
  // Add click event handler if provided
  if (item.onClick && typeof item.onClick === "function") {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      item.onClick(item, index);
    });
  }
  
  div.appendChild(link);
  return div;
}

// Render breadcrumb items
if (breadcrumbData && Array.isArray(breadcrumbData) && breadcrumbData.length > 0) {
  var itemsToRender = breadcrumbData;
  
  // Apply max items limit if configured
  if (maxItems > 0 && breadcrumbData.length > maxItems) {
    // Keep first items up to maxItems
    itemsToRender = breadcrumbData.slice(0, maxItems);
  }
  
  // Calculate width percentage for each item
  var itemWidth = 100 / itemsToRender.length;
  
  // Render each breadcrumb item
  itemsToRender.forEach(function(item, index) {
    var isLast = index === itemsToRender.length - 1;
    var breadcrumbItem = createBreadcrumbItem(item, index, isLast, itemsToRender.length);
    breadcrumbItem.style.width = itemWidth + "%";
    breadcrumbList.appendChild(breadcrumbItem);
  });
} else {
  // If no data, show a default breadcrumb
  var defaultItem = createBreadcrumbItem({ label: "Home", href: "#" }, 0, true, 1);
  defaultItem.style.width = "100%";
  breadcrumbList.appendChild(defaultItem);
}

console.log("Breadcrumb updated with", breadcrumbData ? breadcrumbData.length : 0, "items");
```

## Event Handler Usage

The `change` event is automatically triggered by IBM BAW when:
- The bound business data is updated
- The user navigates to a different page/view
- The breadcrumb path changes programmatically

### Configuration Options

- **showNumbering** (boolean, default: true): Display numbers before breadcrumb labels (e.g., "1. Home", "2. Products")
- **maxItems** (number, default: 0): Maximum number of breadcrumb items to display. 0 means no limit. If exceeded, only the first N items are shown.

### Example: Dynamic Breadcrumb Update

```javascript
// In your BAW coach/view, update the breadcrumb data
tw.local.breadcrumbData = [
  { label: "Home", href: "/", status: "completed" },
  { label: "New Section", href: "/new-section", status: "completed" },
  { label: "Current Page", href: "/new-section/current", status: "working" }
];

// The change event handler will automatically re-render the breadcrumb
```

### Status Values

Each breadcrumb item can have a `status` property:
- **completed**: Item has been completed (shows completed icon)
- **working**: Currently active/working item (shows working icon)
- **notyetstarted**: Item not yet started (shows not started icon)

If no status is provided, it's auto-determined:
- Previous items: `completed`
- Last item: `working`
- Others: `notyetstarted`

### Custom Click Handling

You can provide custom click handlers in the data:

```javascript
tw.local.breadcrumbData = [
  {
    label: "Home",
    href: "/",
    status: "completed",
    onClick: function(item, index) {
      // Custom navigation logic
      console.log("Navigating to:", item.label);
      // Trigger BAW boundary event or custom logic
    }
  }
];