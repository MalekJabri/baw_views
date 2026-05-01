# FolderTree Widget - Event Handlers

## Overview

This document describes all event handlers available in the FolderTree widget and how to use them in IBM Business Automation Workflow (BAW).

---

## Event Handlers

### onSelectionChange

**Description:** Fired when the user selects or deselects files in the list.

**When Triggered:**
- User clicks on a file item
- User checks/unchecks a file checkbox
- User clicks "Select all" or "Unselect all"

**Event Data Structure:**
```javascript
{
  "selectedFiles": [
    {
      "id": "file1",
      "name": "Document.pdf",
      "type": "file",
      "language": "en",
      "documentType": "judgment"
    }
  ],
  "count": 1
}
```

**Usage Example:**
```javascript
// Store selected files in a process variable
tw.local.selectedFiles = this.getData().selectedFiles;
tw.local.selectedFileCount = this.getData().count;

// Enable/disable buttons based on selection
if (this.getData().count > 0) {
  tw.local.canProcessFiles = true;
} else {
  tw.local.canProcessFiles = false;
}
```

**BAW Configuration:**
1. In Process Designer, select the FolderTree widget
2. Go to the "Events" tab
3. Add a handler for "Selection Change"
4. Add your custom logic

---

### onSave

**Description:** Fired when the user clicks the Save button to apply metadata changes to selected files.

**When Triggered:**
- User clicks the "Save" button in the details panel
- At least one file must be selected
- Changes are applied to all selected files

**Event Data Structure:**
```javascript
{
  "selectedFiles": ["file1", "file2", "file3"],
  "updates": {
    "language": "en",
    "documentType": "judgment"
  }
}
```

**Usage Example:**
```javascript
// Get the updates
var selectedFileIds = this.getData().selectedFiles;
var updates = this.getData().updates;

// Update the files in your business object
selectedFileIds.forEach(function(fileId) {
  var file = findFileById(tw.local.uploadedFiles.files, fileId);
  if (file) {
    if (updates.language) {
      file.language = updates.language;
      file.metadata.language = getLanguageName(updates.language);
    }
    if (updates.documentType) {
      file.documentType = updates.documentType;
      file.metadata.documentType = getDocumentTypeName(updates.documentType);
    }
  }
});

// Trigger a refresh or save to database
tw.local.uploadedFiles = tw.local.uploadedFiles;

// Show success message
tw.local.saveMessage = "Changes saved successfully for " + selectedFileIds.length + " file(s)";
```

**Helper Functions:**
```javascript
// Find file by ID in nested structure
function findFileById(files, targetId) {
  for (var i = 0; i < files.length; i++) {
    if (files[i].id === targetId) {
      return files[i];
    }
    if (files[i].children) {
      var found = findFileById(files[i].children, targetId);
      if (found) return found;
    }
  }
  return null;
}

// Get language display name
function getLanguageName(code) {
  var languages = {
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
    'it': 'Italian'
  };
  return languages[code] || code;
}

// Get document type display name
function getDocumentTypeName(code) {
  var types = {
    'judgment': 'Judgment',
    'indictment': 'Indictment',
    'contract': 'Contract',
    'report': 'Report',
    'invoice': 'Invoice'
  };
  return types[code] || code;
}
```

---

### onCopyFile

**Description:** Fired when the user clicks the copy button for a specific file.

**When Triggered:**
- User clicks the copy icon button on a file item

**Event Data Structure:**
```javascript
{
  "fileId": "file1"
}
```

**Usage Example:**
```javascript
// Get the file ID
var fileId = this.getData().fileId;

// Find the file
var file = findFileById(tw.local.uploadedFiles.files, fileId);

if (file) {
  // Create a copy with a new ID
  var copy = {
    id: generateUniqueId(),
    name: file.name + " (Copy)",
    type: file.type,
    language: file.language,
    documentType: file.documentType,
    metadata: {
      language: file.metadata.language,
      documentType: file.metadata.documentType
    }
  };
  
  // Add to the files list
  tw.local.uploadedFiles.files.push(copy);
  
  // Refresh the widget
  tw.local.uploadedFiles = tw.local.uploadedFiles;
  
  // Show success message
  tw.local.message = "File copied successfully";
}
```

---

### onDeleteFile

**Description:** Fired when the user clicks the delete button for a specific file.

**When Triggered:**
- User clicks the delete icon button on a file item

**Event Data Structure:**
```javascript
{
  "fileId": "file1"
}
```

**Usage Example:**
```javascript
// Get the file ID
var fileId = this.getData().fileId;

// Confirm deletion (optional)
if (confirm("Are you sure you want to delete this file?")) {
  // Remove the file from the data structure
  removeFileById(tw.local.uploadedFiles.files, fileId);
  
  // Refresh the widget
  tw.local.uploadedFiles = tw.local.uploadedFiles;
  
  // Show success message
  tw.local.message = "File deleted successfully";
}
```

**Helper Function:**
```javascript
// Remove file by ID from nested structure
function removeFileById(files, targetId) {
  for (var i = 0; i < files.length; i++) {
    if (files[i].id === targetId) {
      files.splice(i, 1);
      return true;
    }
    if (files[i].children) {
      if (removeFileById(files[i].children, targetId)) {
        return true;
      }
    }
  }
  return false;
}
```

---

## Event Handler Best Practices

### 1. Data Validation

Always validate the event data before processing:

```javascript
var data = this.getData();

if (!data || !data.selectedFiles) {
  console.error("Invalid event data");
  return;
}

// Process the data
```

### 2. Error Handling

Wrap your event handlers in try-catch blocks:

```javascript
try {
  var fileId = this.getData().fileId;
  // Process the file
} catch (error) {
  console.error("Error processing file:", error);
  tw.local.errorMessage = "An error occurred: " + error.message;
}
```

### 3. User Feedback

Provide feedback to users after operations:

```javascript
// Success message
tw.local.successMessage = "Changes saved successfully";
tw.local.showSuccessMessage = true;

// Error message
tw.local.errorMessage = "Failed to save changes";
tw.local.showErrorMessage = true;
```

### 4. Refresh Widget Data

After modifying the data structure, trigger a refresh:

```javascript
// Modify the data
tw.local.uploadedFiles.files.push(newFile);

// Trigger refresh by reassigning
tw.local.uploadedFiles = tw.local.uploadedFiles;
```

---

## Complete Integration Example

### BAW Coach View Setup

```javascript
// Initialize data on page load
tw.local.uploadedFiles = {
  files: []
};

tw.local.selectedFileCount = 0;
tw.local.canSave = false;
```

### onSelectionChange Handler

```javascript
// Update selection state
tw.local.selectedFileCount = this.getData().count;
tw.local.canSave = this.getData().count > 0;

// Store selected file IDs
tw.local.selectedFileIds = this.getData().selectedFiles.map(function(f) {
  return f.id;
});
```

### onSave Handler

```javascript
try {
  var selectedFileIds = this.getData().selectedFiles;
  var updates = this.getData().updates;
  
  // Update files
  selectedFileIds.forEach(function(fileId) {
    var file = findFileById(tw.local.uploadedFiles.files, fileId);
    if (file) {
      if (updates.language) {
        file.language = updates.language;
      }
      if (updates.documentType) {
        file.documentType = updates.documentType;
      }
    }
  });
  
  // Persist changes (call service, update database, etc.)
  tw.local.uploadedFiles = tw.local.uploadedFiles;
  
  // Show success
  tw.local.successMessage = "Saved changes for " + selectedFileIds.length + " file(s)";
  tw.local.showSuccess = true;
  
} catch (error) {
  tw.local.errorMessage = "Failed to save: " + error.message;
  tw.local.showError = true;
}
```

### onCopyFile Handler

```javascript
try {
  var fileId = this.getData().fileId;
  var file = findFileById(tw.local.uploadedFiles.files, fileId);
  
  if (file) {
    var copy = JSON.parse(JSON.stringify(file)); // Deep clone
    copy.id = "file_" + new Date().getTime();
    copy.name = file.name + " (Copy)";
    
    tw.local.uploadedFiles.files.push(copy);
    tw.local.uploadedFiles = tw.local.uploadedFiles;
    
    tw.local.successMessage = "File copied successfully";
  }
} catch (error) {
  tw.local.errorMessage = "Failed to copy file: " + error.message;
}
```

### onDeleteFile Handler

```javascript
try {
  var fileId = this.getData().fileId;
  
  // Remove file
  removeFileById(tw.local.uploadedFiles.files, fileId);
  
  // Refresh
  tw.local.uploadedFiles = tw.local.uploadedFiles;
  
  // Update selection if deleted file was selected
  if (tw.local.selectedFileIds && tw.local.selectedFileIds.indexOf(fileId) !== -1) {
    tw.local.selectedFileIds = tw.local.selectedFileIds.filter(function(id) {
      return id !== fileId;
    });
    tw.local.selectedFileCount = tw.local.selectedFileIds.length;
  }
  
  tw.local.successMessage = "File deleted successfully";
  
} catch (error) {
  tw.local.errorMessage = "Failed to delete file: " + error.message;
}
```

---

## Debugging Event Handlers

### Console Logging

```javascript
// Log event data
console.log("Event data:", JSON.stringify(this.getData(), null, 2));

// Log current state
console.log("Current files:", tw.local.uploadedFiles);
console.log("Selected count:", tw.local.selectedFileCount);
```

### Breakpoints

Use the browser's developer tools to set breakpoints in your event handlers:

1. Open Developer Tools (F12)
2. Go to Sources tab
3. Find your event handler code
4. Click on the line number to set a breakpoint

---

## Common Issues and Solutions

### Issue: Event not firing

**Solution:**
- Check that the event handler is properly configured in BAW
- Verify the widget is properly bound to data
- Check browser console for JavaScript errors

### Issue: Data not updating

**Solution:**
- Ensure you reassign the variable after modification: `tw.local.data = tw.local.data;`
- Check that the data structure matches the expected format
- Verify the widget's change detection is working

### Issue: Selection state lost after save

**Solution:**
- Store selected file IDs before save
- Restore selection after data refresh
- Use the widget's internal selection state management

---

Made with Bob