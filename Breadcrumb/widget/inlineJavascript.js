// Get the breadcrumb container elements
var breadcrumbContainer = this.context.element.querySelector(".breadcrumb_maincontentbox");
var breadcrumbList = breadcrumbContainer.querySelector(".breadcrumb-list");

// Get the breadcrumb data (array of breadcrumb items)
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
  
  // Add status class to the div for CSS styling
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

// Made with Bob
