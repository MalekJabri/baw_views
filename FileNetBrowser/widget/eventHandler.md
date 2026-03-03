## Event Handlers

The FileNetBrowser widget provides three event handlers that can be bound to BAW coach view events. These handlers are invoked when users interact with the widget.

---

## Available Events

### 1. onFolderSelected

**Triggered when:** A user clicks on a folder in the content list (single-click selection).

**Event Data:**
```javascript
{
  "type":     "folder",
  "id":       "{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}",
  "name":     "Documents",
  "pathName": "/Folder for Browsing/Documents"
}
```

**Properties:**
- `type` (String): Always `"folder"` for this event
- `id` (String): FileNet object ID of the selected folder
- `name` (String): Display name of the folder
- `pathName` (String): Full FileNet path of the folder

**Example BAW Handler:**
```javascript
// Store selected folder in process variable
tw.local.selectedFolder = {
  id:       this.getData().id,
  name:     this.getData().name,
  pathName: this.getData().pathName
};

// Log selection
console.log("Folder selected: " + this.getData().name);

// Enable/disable buttons based on selection
tw.local.canOpenFolder = true;
```

**Use Cases:**
- Store selected folder for later operations
- Enable context-specific actions (e.g., "Open", "Properties")
- Update other UI components based on selection
- Track user navigation patterns

---

### 2. onDocumentSelected

**Triggered when:** A user clicks on a document in the content list (single-click selection) or double-clicks a document.

**Event Data:**
```javascript
{
  "type":    "document",
  "id":      "{D0D98E6A-0000-CD12-BB33-2DC8E5CABEE1}",
  "name":    "report.pdf",
  "version": "v1.0"
}
```

**Properties:**
- `type` (String): Always `"document"` for this event
- `id` (String): FileNet object ID of the selected document
- `name` (String): Display name of the document
- `version` (String): Version string in format "vX.Y" (e.g., "v1.0")

**Example BAW Handler:**
```javascript
// Store selected document in process variable
tw.local.selectedDocument = {
  id:      this.getData().id,
  name:    this.getData().name,
  version: this.getData().version
};

// Open document viewer
tw.local.showDocumentViewer = true;
tw.local.documentToView = this.getData().id;

// Enable document actions
tw.local.canDownload = true;
tw.local.canDelete = true;
```

**Use Cases:**
- Open document in viewer/editor
- Download document
- Display document properties
- Initiate document-specific workflows
- Track document access

---

### 3. onNavigate

**Triggered when:** The user navigates to a different folder through any means:
- Double-clicking a folder
- Clicking breadcrumb links
- Using Back/Forward/Up navigation buttons
- Clicking folders in the tree view

**Event Data:**
```javascript
{
  "pathName": "/Folder for Browsing/Documents"
}
```

**Properties:**
- `pathName` (String): Full FileNet path of the newly navigated folder

**Example BAW Handler:**
```javascript
// Track current location
tw.local.currentPath = this.getData().pathName;

// Update page title or header
tw.local.pageTitle = "Browsing: " + this.getData().pathName;

// Log navigation for audit
console.log("User navigated to: " + this.getData().pathName);

// Clear any previous selections
tw.local.selectedFolder = null;
tw.local.selectedDocument = null;

// Update navigation history
if (!tw.local.navigationHistory) {
  tw.local.navigationHistory = [];
}
tw.local.navigationHistory.push({
  path: this.getData().pathName,
  timestamp: new Date().toISOString()
});
```

**Use Cases:**
- Track user navigation path
- Update breadcrumb or location display
- Clear previous selections
- Enable/disable navigation-dependent features
- Audit folder access

---

## Event Registration

The widget registers these event handlers in the inline JavaScript:

```javascript
this.registerEventHandlingFunction(this, "onFolderSelected", null);
this.registerEventHandlingFunction(this, "onDocumentSelected", null);
this.registerEventHandlingFunction(this, "onNavigate", null);
```

---

## Event Invocation

The widget invokes these events using:

```javascript
this.executeEventHandlingFunction(this, "eventName", eventData);
```

---

## Multi-Selection Support

When `allowMultiSelect` option is enabled, users can select multiple items using Ctrl/Cmd+Click. However, the event handlers are still fired for each individual selection/deselection.

**Example Multi-Select Handler:**
```javascript
// onFolderSelected or onDocumentSelected
if (!tw.local.selectedItems) {
  tw.local.selectedItems = [];
}

// Add to selection list
tw.local.selectedItems.push({
  type:    this.getData().type,
  id:      this.getData().id,
  name:    this.getData().name,
  version: this.getData().version // documents only
});

// Update UI
tw.local.selectionCount = tw.local.selectedItems.length;
```

---

## Accessing Event Data

In BAW coach view event handlers, access the event data using:

```javascript
this.getData()
```

This returns the complete event data object as described above for each event type.

---

## Common Patterns

### Pattern 1: Master-Detail View

```javascript
// onDocumentSelected
tw.local.selectedDocumentId = this.getData().id;
tw.local.showDetailPanel = true;

// Trigger service call to fetch full document details
tw.system.model.DocumentService.getDocumentDetails(
  tw.local.selectedDocumentId
);
```

### Pattern 2: Conditional Actions

```javascript
// onFolderSelected
var folderPath = this.getData().pathName;

// Enable upload only for specific folders
tw.local.canUpload = folderPath.startsWith("/Folder for Browsing/Uploads");

// Enable delete only for non-root folders
tw.local.canDelete = folderPath !== "/";
```

### Pattern 3: Navigation Tracking

```javascript
// onNavigate
if (!tw.local.visitedFolders) {
  tw.local.visitedFolders = {};
}

var path = this.getData().pathName;
if (!tw.local.visitedFolders[path]) {
  tw.local.visitedFolders[path] = {
    firstVisit: new Date().toISOString(),
    visitCount: 0
  };
}
tw.local.visitedFolders[path].visitCount++;
tw.local.visitedFolders[path].lastVisit = new Date().toISOString();
```

### Pattern 4: Cascading Updates

```javascript
// onFolderSelected
var folderId = this.getData().id;

// Update related widgets
tw.local.folderPropertiesWidget.folderId = folderId;
tw.local.folderPermissionsWidget.folderId = folderId;

// Refresh dependent data
tw.system.model.FolderService.getFolderMetadata(folderId);
```

---

## Error Handling

Event handlers should include error handling for robustness:

```javascript
try {
  // onDocumentSelected
  var docId = this.getData().id;
  
  if (!docId) {
    throw new Error("Document ID is missing");
  }
  
  tw.local.selectedDocument = this.getData();
  
  // Perform operations...
  
} catch (error) {
  console.error("Error in onDocumentSelected:", error);
  tw.local.errorMessage = "Failed to select document: " + error.message;
  tw.local.showError = true;
}
```

---

## Performance Considerations

1. **Avoid Heavy Operations**: Event handlers fire frequently during user interaction. Keep them lightweight.

2. **Debounce Expensive Calls**: If triggering service calls, consider debouncing:
```javascript
// onNavigate
clearTimeout(tw.local.navigationTimer);
tw.local.navigationTimer = setTimeout(function() {
  // Expensive operation here
  tw.system.model.AuditService.logNavigation(this.getData().pathName);
}, 500);
```

3. **Batch Updates**: When handling multiple selections, batch process them:
```javascript
// onDocumentSelected (multi-select)
if (!tw.local.pendingSelections) {
  tw.local.pendingSelections = [];
}
tw.local.pendingSelections.push(this.getData());

// Process batch after delay
clearTimeout(tw.local.selectionTimer);
tw.local.selectionTimer = setTimeout(function() {
  processBatchSelections(tw.local.pendingSelections);
  tw.local.pendingSelections = [];
}, 300);
```

---

## Testing Event Handlers

To test event handlers in BAW Coach View designer:

1. Add the widget to a coach view
2. Configure the required options (graphqlEndpoint, repositoryIdentifier)
3. Bind event handlers to coach view events
4. Add logging to track event data:
```javascript
console.log("Event fired:", JSON.stringify(this.getData(), null, 2));
```
5. Run the coach view in preview mode
6. Interact with the widget and check browser console

---

## Best Practices

1. **Always validate event data** before using it
2. **Use meaningful variable names** when storing event data
3. **Clear previous selections** when appropriate (e.g., on navigation)
4. **Provide user feedback** for actions triggered by events
5. **Log important events** for debugging and audit purposes
6. **Handle errors gracefully** to prevent widget crashes
7. **Keep handlers focused** - one responsibility per handler
8. **Document complex logic** in event handlers for maintainability