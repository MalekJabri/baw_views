# MultiDocumentUpload Widget - Event Handler Documentation

## Overview

The MultiDocumentUpload widget uses the **change** event to respond to data updates. This event is triggered when the bound data (list of documents) changes, allowing the widget to refresh its display.

## Supported Events

### change.js

**Trigger:** Executed when the widget's bound data changes

**Purpose:** 
- Re-render the document table when external data changes
- Synchronize widget state with updated document list
- Update UI elements (document count, button states)

**Use Case:**
When the bound data is modified externally (e.g., by another widget or process logic), the change event ensures the MultiDocumentUpload widget reflects the current state.

## Event Implementation

### change.js

```javascript
// MultiDocumentUpload - Change Event Handler
// Executed when the widget data changes
var _this = this;

// Get the updated data
var data = _this.getData();

console.log('MultiDocumentUpload data changed:', data);

// The widget's main JavaScript will handle the re-rendering
// through its internal state management
```

## Event Flow

### 1. Data Binding Update
```
External Change → BAW Data Binding → change.js Event → Widget Re-render
```

### 2. Internal State Changes
```
User Action → Widget Logic → setData() → change.js Event → UI Update
```

## When Events Are Triggered

### change.js is triggered when:

1. **External Data Update**
   - Another widget modifies the bound document list
   - Process logic updates the document variable
   - Initial data load when the coach view opens

2. **Internal Upload Action**
   - User clicks "Upload u LocalStore" button
   - Documents are converted to base64 and added to the list
   - `widget.setData()` is called, triggering the change event

3. **Document Deletion**
   - User deletes an uploaded document
   - Document is removed from the list
   - `widget.setData()` is called, triggering the change event

## Event Handler Best Practices

### DO:
- ✅ Keep event handlers lightweight
- ✅ Use event handlers for synchronization with external changes
- ✅ Log important state changes for debugging
- ✅ Let the main widget logic handle complex rendering

### DON'T:
- ❌ Duplicate rendering logic in event handlers
- ❌ Perform heavy computations in event handlers
- ❌ Modify data directly without using `setData()`
- ❌ Create circular event triggers

## Integration with BAW Events

### Custom Event Registration

If you need to respond to custom BAW events, you can register them in the widget's initialization:

```javascript
// In inlineJavascript.js
bpmext.ui.registerEventHandlingFunction(
  this,
  "DocumentUploadComplete",
  "customEventName"
);
```

### Firing Custom Events

After successful upload, you can fire custom events to notify other widgets:

```javascript
// Fire custom event after upload
this.context.trigger({
  type: "DocumentUploadComplete",
  data: {
    documentCount: state.documents.length,
    documents: state.documents
  }
});
```

## Event Debugging

### Enable Console Logging

The widget includes console logging for debugging:

```javascript
console.log('MultiDocumentUpload data changed:', data);
```

### Monitor Event Flow

To debug event flow in BAW:

1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for widget event messages
4. Check the data structure being passed

### Common Issues

**Issue:** Change event not firing
- **Cause:** Data binding not properly configured
- **Solution:** Verify the widget is bound to a List<DocumentItem> variable

**Issue:** Infinite event loop
- **Cause:** Event handler modifying data, triggering another event
- **Solution:** Use flags to prevent recursive updates

**Issue:** UI not updating after data change
- **Cause:** Change event not re-rendering the widget
- **Solution:** Ensure the main widget logic responds to data changes

## Event Lifecycle

```
1. Widget Load
   ↓
2. Initial Data Binding (change event)
   ↓
3. User Interaction (file selection, type change, delete)
   ↓
4. Upload Action (setData → change event)
   ↓
5. External Data Update (change event)
   ↓
6. Widget Re-render
```

## Performance Considerations

### Optimize Event Handling

1. **Debounce Rapid Changes**
   - If data changes frequently, consider debouncing the re-render
   - Prevents excessive DOM updates

2. **Selective Re-rendering**
   - Only update changed elements instead of full re-render
   - Use document IDs to track changes

3. **Lazy Loading**
   - For large document lists, implement pagination
   - Load documents on-demand

## Example Usage Scenarios

### Scenario 1: Pre-populate Documents

```javascript
// In BAW coach view initialization
tw.local.uploadedDocuments = [
  {
    id: "doc_001",
    fileName: "existing_document.pdf",
    fileSize: 245760,
    fileExtension: "pdf",
    documentType: "invoice",
    fileContent: "base64content...",
    uploadedAt: "2024-01-01T12:00:00.000Z",
    uploaded: true
  }
];
// Widget's change event will render the pre-populated document
```

### Scenario 2: Clear Documents Externally

```javascript
// Clear all documents from outside the widget
tw.local.uploadedDocuments = [];
// Widget's change event will show empty state
```

### Scenario 3: Add Document Programmatically

```javascript
// Add a document from another source
var newDoc = {
  id: "doc_external_001",
  fileName: "system_generated.pdf",
  fileSize: 102400,
  fileExtension: "pdf",
  documentType: "report",
  fileContent: "base64content...",
  uploadedAt: new Date().toISOString(),
  uploaded: true
};
tw.local.uploadedDocuments.push(newDoc);
// Widget's change event will add the new document to the table
```

## Notes

- The widget primarily uses the **change** event for data synchronization
- Other BAW lifecycle events (load, view, validate, unload) are not required for this widget's functionality
- The main widget logic in `inlineJavascript.js` handles most of the interactive behavior
- Event handlers should remain simple and delegate complex logic to the main widget code

<!-- Made with Bob -->